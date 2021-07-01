import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ABCWidgetFactory,
  DocumentRegistry,
  DocumentWidget
} from '@jupyterlab/docregistry';
// import { Widget } from '@lumino/widgets';

import { WidgetTracker, IWidgetTracker } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import { IFrame } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { Token } from '@lumino/coreutils';
import { PromiseDelegate } from '@lumino/coreutils';

import { PageConfig } from '@jupyterlab/coreutils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { requestAPI } from './handler';

import webvizIconSvgstr from '../style/logo.svg';

export const webvizIcon = new LabIcon({
  name: 'jupyterlab-webviz:icon',
  svgstr: webvizIconSvgstr
});

// rosbridge-websocket-url
// remote-bag-url
// seek-to // ms since unix epoch
// layout-url
// global-variables // url encoded json

interface IWebVizOptions {
  rosbridgeWebsocketUrl?: string;
  remoteBagUrl?: string;
  seekTo?: number;
  layout?: any;
}

class WebvizIframeWidget extends IFrame {
  query: string;

  trigger(webvizOptions: IWebVizOptions) {
    const queryElems = [];

    for (const k in webvizOptions as any) {
      const kk = k.replace(
        /[A-Z]/g,
        (letter: string) => `-${letter.toLowerCase()}`
      );
      queryElems.push(
        encodeURIComponent(kk) +
          '=' +
          encodeURIComponent((webvizOptions as any)[k])
      );
    }
    this.query = queryElems.join('&');

    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + `webviz/app/index.html?${this.query}`;
    console.log('Full URL: ', this.url);
  }

  constructor(webvizOptions: IWebVizOptions) {
    super();
    this.query = '';
    // const queryElems = [];
    // for (const k in webvizOptions as any) {
    //   let kk = k;
    //   kk.replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);
    //   queryElems.push(
    //     encodeURIComponent(kk) + '=' + encodeURIComponent((webvizOptions as any)[k])
    //   );
    // }
    // this.query = queryElems.join('&');

    // const baseUrl = PageConfig.getBaseUrl();
    // this.url = baseUrl + `webviz/app/index.html?${this.query}`;

    this.id = 'Webviz';
    this.title.label = 'Webviz';
    this.title.closable = true;
    this.title.icon = webvizIcon;
    this.node.style.overflowY = 'hidden';
    this.node.style.background = '#FFF';

    this.sandbox = [
      'allow-forms',
      'allow-modals',
      'allow-orientation-lock',
      'allow-pointer-lock',
      'allow-popups',
      'allow-presentation',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation',
      'allow-top-navigation-by-user-activation'
    ];
  }

  dispose(): void {
    super.dispose();
  }
  onCloseRequest(): void {
    this.dispose();
  }
}

export class WebvizWidget extends DocumentWidget<WebvizIframeWidget> {
  defaultROSEndpoint = '';
  private _ready = new PromiseDelegate<void>();

  constructor(
    options: DocumentWidget.IOptions<WebvizIframeWidget>,
    defaultROSEndpoint: string
  ) {
    super({ ...options });
    this.defaultROSEndpoint = defaultROSEndpoint;

    this.title.icon = webvizIcon;

    this.context.ready.then(() => {
      this._onContextReady();
    });
  }

  _onContentChanged(): void {
    console.log('Content changed?');
  }

  /**
   * A promise that resolves when the zethus viewer is ready.
   */
  get ready(): Promise<void> {
    return this._ready.promise;
  }

  _onContextReady(): void {
    const contextModel = this.context.model;
    // if (contextModel.toString() === '') {
    // contextModel.fromString();
    // }

    // Set the editor model value.
    // this._onContentChanged();
    contextModel.contentChanged.connect(this._onContentChanged, this);
    let layout = {};
    try {
      layout = JSON.parse(this.context.model.toString());
    } catch (e) {
      // ignore
    }

    this.content.trigger({
      rosbridgeWebsocketUrl: this.defaultROSEndpoint,
      layout: JSON.stringify(layout)
    });

    // let widget = new WebvizIframeWidget({});
    // console.log(widget)
    // this.content.addChild(widget);

    this._ready.resolve(void 0);
  }
}

/**
 * A widget factory for drawio.
 */
export class WebvizFactory extends ABCWidgetFactory<
  WebvizWidget,
  DocumentRegistry.IModel
> {
  /**
   * Create a new widget given a context.
   */
  constructor(
    options: DocumentRegistry.IWidgetFactoryOptions,
    defaultROSEndpoint: string
  ) {
    super(options);
    this.defaultROSEndpoint = defaultROSEndpoint;
  }

  protected createNewWidget(context: DocumentRegistry.Context): WebvizWidget {
    return new WebvizWidget(
      { context, content: new WebvizIframeWidget({}) },
      this.defaultROSEndpoint
    );
  }

  defaultROSEndpoint: string;
}

type IWebvizTracker = IWidgetTracker<WebvizWidget>;
export const IWebvizTracker = new Token<IWebvizTracker>('webviz/track');

/**
 * The name of the factory that creates editor widgets.
 */
const FACTORY = 'WebvizFactory';

/**
 * Initialization data for the jupyterlab-webviz extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-webviz:plugin',
  autoStart: true,
  requires: [IFileBrowserFactory, ILayoutRestorer],
  optional: [ISettingRegistry, ILauncher],
  activate: async (
    app: JupyterFrontEnd,
    browserFactory: IFileBrowserFactory,
    restorer: ILayoutRestorer,
    settingRegistry: ISettingRegistry | null,
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension jupyterlab-webviz is activated!');

    let defaultROSEndpoint = 'ws://localhost:9090';

    if (settingRegistry) {
      const settings = await settingRegistry.load(plugin.id);
      defaultROSEndpoint = settings.get('defaultROSEndpoint')
        .composite as string;
      console.log('jupyterlab-webviz settings loaded:', settings.composite);
    }

    const namespace = 'jupyterlab-webviz';
    const { commands } = app;
    const tracker = new WidgetTracker<WebvizWidget>({ namespace });

    const factory = new WebvizFactory(
      { name: FACTORY, fileTypes: ['webviz'], defaultFor: ['webviz'] },
      defaultROSEndpoint
    );

    // Handle state restoration.
    restorer.restore(tracker, {
      command: 'docmanager:open',
      args: widget => ({ path: widget.context.path, factory: FACTORY }),
      name: widget => widget.context.path
    });

    factory.widgetCreated.connect((sender, widget) => {
      // Notify the instance tracker if restore data needs to update.
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      tracker.add(widget);
    });
    app.docRegistry.addWidgetFactory(factory);

    // Function to create a new untitled diagram file, given
    // the current working directory.
    const createNewWebviz = (cwd: string) => {
      return commands
        .execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: '.webviz'
        })
        .then(model => {
          return commands.execute('docmanager:open', {
            path: model.path,
            factory: FACTORY
          });
        });
    };

    app.docRegistry.addFileType({
      name: 'webviz',
      displayName: 'Webviz File',
      mimeTypes: ['application/json'],
      extensions: ['.webviz'],
      icon: webvizIcon,
      fileFormat: 'text'
    });

    commands.addCommand('webviz:launch', {
      label: 'Webviz',
      icon: webvizIcon,
      caption: 'Launch the Webviz viewer',
      execute: () => {
        const cwd = browserFactory.defaultBrowser.model.path;
        return createNewWebviz(cwd);
      }
      // isEnabled
    });

    // app.commands.addCommand("webviz:open", {
    //   label: 'Webviz',
    //   icon: webvizIcon,
    //   execute: () => {
    //     let widget = new WebvizWidget({}, defaultROSEndpoint);
    //     app.shell.add(widget, 'main');
    //     // Activate the widget
    //     app.shell.activateById(widget.id);
    //   },
    // });

    // Add a launcher item if the launcher is available.
    if (launcher) {
      launcher.add({
        command: 'webviz:launch',
        rank: 5,
        category: 'Robotics'
      });
    }

    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab-webviz server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
