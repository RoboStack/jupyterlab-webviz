/*! For license information please see main-thread-chartjs.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{3186:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _chart=_interopRequireDefault(__webpack_require__(2285)),_ChartJSManager=_interopRequireDefault(__webpack_require__(3187)),_installChartjs=_interopRequireDefault(__webpack_require__(3189)),_Rpc=_interopRequireDefault(__webpack_require__(144)),_RpcWorkerUtils=__webpack_require__(2570),_workers=__webpack_require__(439);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}let hasInstalledChartjs=!1;exports.default=class{constructor(rpc){_defineProperty(this,"_rpc",void 0),_defineProperty(this,"_managersById",void 0),hasInstalledChartjs||((0,_installChartjs.default)(_chart.default),hasInstalledChartjs=!0),this._managersById={},(0,_workers.inWebWorker)()&&this._rpc instanceof _Rpc.default&&(0,_RpcWorkerUtils.setupWorker)(this._rpc),rpc.receive("initialize",args=>{const manager=new _ChartJSManager.default(args);return this._managersById[args.id]=manager,this._managersById[args.id].getScaleBounds()}),rpc.receive("doZoom",args=>{var _this$_managersById$a;return null===(_this$_managersById$a=this._managersById[args.id])||void 0===_this$_managersById$a?void 0:_this$_managersById$a.doZoom(args)}),rpc.receive("resetZoomDelta",args=>{var _this$_managersById$a2;return null===(_this$_managersById$a2=this._managersById[args.id])||void 0===_this$_managersById$a2?void 0:_this$_managersById$a2.resetZoomDelta(args)}),rpc.receive("doPan",args=>{var _this$_managersById$a3;return null===(_this$_managersById$a3=this._managersById[args.id])||void 0===_this$_managersById$a3?void 0:_this$_managersById$a3.doPan(args)}),rpc.receive("resetPanDelta",args=>{var _this$_managersById$a4;return null===(_this$_managersById$a4=this._managersById[args.id])||void 0===_this$_managersById$a4?void 0:_this$_managersById$a4.resetPanDelta(args)}),rpc.receive("update",args=>{var _this$_managersById$a5;return null===(_this$_managersById$a5=this._managersById[args.id])||void 0===_this$_managersById$a5?void 0:_this$_managersById$a5.update(args)}),rpc.receive("resetZoom",args=>{var _this$_managersById$a6;return null===(_this$_managersById$a6=this._managersById[args.id])||void 0===_this$_managersById$a6?void 0:_this$_managersById$a6.resetZoom(args)}),rpc.receive("destroy",args=>{const manager=this._managersById[args.id];if(manager){const result=manager.destroy(args);return delete this._managersById[args.id],result}}),rpc.receive("getElementAtXAxis",args=>{var _this$_managersById$a7;return null===(_this$_managersById$a7=this._managersById[args.id])||void 0===_this$_managersById$a7?void 0:_this$_managersById$a7.getElementAtXAxis(args)}),rpc.receive("getDatalabelAtEvent",args=>{var _this$_managersById$a8;return null===(_this$_managersById$a8=this._managersById[args.id])||void 0===_this$_managersById$a8?void 0:_this$_managersById$a8.getDatalabelAtEvent(args)})}}},3187:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _chart=_interopRequireDefault(__webpack_require__(2285)),_keyBy=_interopRequireDefault(__webpack_require__(3188)),_omit=_interopRequireDefault(__webpack_require__(2508)),_zoomAndPanHelpers=__webpack_require__(647);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_defineProperty(target,key,source[key])}))}return target}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function hideAllTicksScaleCallback(){return""}function hideFirstAndLastTicksScaleCallback(value,index,values){return 0===index||index===values.length-1?"":""+Math.round(1e3*value)/1e3}function displayTicksInSecondsCallback(value){return Math.round(1e3*value)/1e3+" s"}function mapChartElementToEventElement(chartInstance,item){var _chartInstance$data$d;return{data:null===(_chartInstance$data$d=chartInstance.data.datasets[item._datasetIndex])||void 0===_chartInstance$data$d?void 0:_chartInstance$data$d.data[item._index],view:item._view}}const datasetKeyProvider=d=>d.label;exports.default=class{constructor({id:id,node:node,type:type,data:data,options:options,scaleOptions:scaleOptions,devicePixelRatio:devicePixelRatio}){_defineProperty(this,"id",void 0),_defineProperty(this,"_node",void 0),_defineProperty(this,"_chartInstance",void 0),this.id=id,this._node=node;const chartInstance=new _chart.default(node,{type:type,data:data,options:_objectSpread({},this._addFunctionsToConfig(options,scaleOptions),{devicePixelRatio:devicePixelRatio}),plugins:{}});this._chartInstance=chartInstance}getScaleBounds(){const chartInstance=this._chartInstance;if(chartInstance)return(0,_zoomAndPanHelpers.getScaleBounds)(chartInstance)}doZoom({zoomOptions:zoomOptions,percentZoomX:percentZoomX,percentZoomY:percentZoomY,focalPoint:focalPoint,whichAxesParam:whichAxesParam}){const chartInstance=this._chartInstance;if(chartInstance)return(0,_zoomAndPanHelpers.doZoom)(this.id,chartInstance,zoomOptions,percentZoomX,percentZoomY,focalPoint,whichAxesParam),(0,_zoomAndPanHelpers.getScaleBounds)(chartInstance)}resetZoomDelta(){this._chartInstance&&(0,_zoomAndPanHelpers.resetZoomDelta)(this.id)}doPan({panOptions:panOptions,deltaX:deltaX,deltaY:deltaY}){const chartInstance=this._chartInstance;if(chartInstance)return(0,_zoomAndPanHelpers.doPan)(this.id,chartInstance,panOptions,deltaX,deltaY),(0,_zoomAndPanHelpers.getScaleBounds)(chartInstance)}resetPanDelta(){(0,_zoomAndPanHelpers.resetPanDelta)(this.id)}update({data:data,options:options,scaleOptions:scaleOptions}){const chartInstance=this._chartInstance;if(!chartInstance)return;options&&(options=this._addFunctionsToConfig(options,scaleOptions),chartInstance.options=_chart.default.helpers.configMerge(chartInstance.options,options));const currentDatasets=this._getCurrentDatasets(),nextDatasets=data&&data.datasets||[];this._checkDatasets(currentDatasets);const currentDatasetsIndexed=(0,_keyBy.default)(currentDatasets,datasetKeyProvider);chartInstance.config.data.datasets=nextDatasets.map(next=>{const current=currentDatasetsIndexed[datasetKeyProvider(next)];if(current&&current.type===next.type&&next.data){current.data.splice(next.data.length),next.data.forEach((point,pid)=>{current.data[pid]=next.data[pid]});const otherDatasetProps=(0,_omit.default)(next,"data");return _objectSpread({},current,otherDatasetProps)}return next});const otherDataProps=(0,_omit.default)(data,"datasets");return chartInstance.config.data=_objectSpread({},chartInstance.config.data,otherDataProps),chartInstance.update(),(0,_zoomAndPanHelpers.getScaleBounds)(chartInstance)}resetZoom(){const chartInstance=this._chartInstance;return chartInstance&&(0,_zoomAndPanHelpers.resetZoom)(this.id,chartInstance),(0,_zoomAndPanHelpers.getScaleBounds)(chartInstance)}destroy(){const chartInstance=this._chartInstance;chartInstance&&chartInstance.destroy(),this._chartInstance=null}getElementAtXAxis({event:event}){const chartInstance=this._chartInstance;if(chartInstance){const pointElements=chartInstance.getElementsAtEventForMode(event,"point");if(pointElements.length)return mapChartElementToEventElement(chartInstance,pointElements[0]);const xAxisElements=chartInstance.getElementsAtEventForMode(event,"x",{intersect:!1});if(xAxisElements.length){const nearestXAxisElement=chartInstance.getElementsAtEventForMode(event,"nearest",{intersect:!1}).find(item=>xAxisElements.some(item2=>item._index===item2._index&&item._datasetIndex===item2._datasetIndex));return mapChartElementToEventElement(chartInstance,nearestXAxisElement?nearestXAxisElement:xAxisElements[0])}}}getDatalabelAtEvent({event:event}){const chartInstance=this._chartInstance;if(chartInstance){const chartDatalabel=chartInstance.$datalabels.getLabelAtEvent(event);if(chartDatalabel){const context=chartDatalabel.$context;return context.dataset.data[context.dataIndex]}}}_addFunctionsToConfig(config,scaleOptions){if(config&&config.plugins.datalabels){config.plugins.datalabels.formatter=(value,_context)=>{const label=null==value?void 0:value.label;return null!=label?label:null};const staticColor=config.plugins.datalabels.color||"white";config.plugins.datalabels.color=context=>{const value=context.dataset.data[context.dataIndex];return(null==value?void 0:value.labelColor)||staticColor}}if(scaleOptions){for(const scale of config.scales.yAxes)null!=scaleOptions.fixedYAxisWidth&&(scale.afterFit=scaleInstance=>{scaleInstance.width=scaleOptions.fixedYAxisWidth}),scale.ticks=scale.ticks||{},"hide"===scaleOptions.yAxisTicks?scale.ticks.callback=hideAllTicksScaleCallback:"hideFirstAndLast"===scaleOptions.yAxisTicks&&(scale.ticks.callback=hideFirstAndLastTicksScaleCallback);for(const scale of config.scales.xAxes)scale.ticks=scale.ticks||{},scaleOptions.xAxisTicks&&("displayXAxesTicksInSeconds"===scaleOptions.xAxisTicks?scale.ticks.callback=displayTicksInSecondsCallback:scale.ticks.callback=hideFirstAndLastTicksScaleCallback)}return config}_checkDatasets(datasets){datasets.length}_getCurrentDatasets(){return this._chartInstance&&this._chartInstance.config.data&&this._chartInstance.config.data.datasets||[]}}},3189:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(Chart=_chart.default){const annotationPlugin=__webpack_require__(3191),datalabelPlugin=__webpack_require__(3198);if(Chart.plugins.register(annotationPlugin),Chart.plugins.register(datalabelPlugin),(0,_multicolorLineChart.default)(Chart),Chart.defaults.global.plugins.datalabels={},Chart.defaults.global.plugins.datalabels.display=!1,5!==Chart.plugins.count())throw new Error("Incorrect number of Chart.js plugins; one probably has not loaded correctly (make sure we don't have duplicate chart.js instances when running `yarn list`.")};var _chart=_interopRequireDefault(__webpack_require__(2285)),_multicolorLineChart=_interopRequireDefault(__webpack_require__(3190));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}},3190:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(Chart){Chart.defaults.multicolorLine=Chart.defaults.scatter,Chart.controllers.multicolorLine=Chart.controllers.scatter.extend({draw(ease){let startIndex=0;const meta=this.getMeta(),points=meta.data||[],colors=this.getDataset().colors,area=this.chart.chartArea,{multicolorLineYOffset:multicolorLineYOffset}=this.chart.options.plugins||{};multicolorLineYOffset&&meta.dataset._children.forEach(data=>{data._view.originalY||(data._view.originalY=data._view.y),data._view.y=data._view.originalY+multicolorLineYOffset});const originalDatasets=meta.dataset._children.filter(data=>!isNaN(data._view.y));function setColor(newColor,{dataset:dataset}){dataset._view.borderColor=newColor}if(colors){for(let i=2;i<=colors.length;i++)colors[i-1]!==colors[i]&&(setColor(colors[i-1],meta),meta.dataset._children=originalDatasets.slice(startIndex,i),meta.dataset.draw(),startIndex=i-1);meta.dataset._children=originalDatasets.slice(startIndex),meta.dataset.draw(),meta.dataset._children=originalDatasets,points.forEach(point=>{point.draw(area)})}else Chart.controllers.scatter.prototype.draw.call(this,ease)}})}}}]);
//# sourceMappingURL=main-thread-chartjs.js.map