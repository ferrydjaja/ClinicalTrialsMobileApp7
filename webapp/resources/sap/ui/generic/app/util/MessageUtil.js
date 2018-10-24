/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.getCore().loadLibrary("sap.m");sap.ui.define(["sap/ui/core/ValueState","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast"],function(V,F,a,M){"use strict";var h={badRequest:"400",unauthorized:"401",forbidden:"403",notFound:"404",methodNotAllowed:"405",preconditionFailed:"428",internalServerError:"500",notImplemented:"501",badGateway:"502",serviceUnavailable:"503",gatewayTimeout:"504",httpVersionNotSupported:"505"};var o={callAction:"callAction",addEntry:"addEntry",saveEntity:"saveEntity",deleteEntity:"deleteEntity",editEntity:"editEntity",modifyEntity:"modifyEntity",activateDraftEntity:"activateDraftEntity",saveAndPrepareDraftEntity:"saveAndPrepareDraftEntity",getCollection:"getCollection"};var m;function g(R){var t=[],e;var f=sap.ui.getCore().getMessageManager();var j=f.getMessageModel().getData();for(var i=0;i<j.length;i++){e=j[i];if(e.getPersistent()){t.push(e);}}jQuery.noop(R);return t;}function c(P,C){var D;D=function(n,f){var e;var i={onMessageDialogClose:function(){f.onMessageDialogClose();e.destroy();}};e=sap.ui.xmlfragment(n,i);if(C){jQuery.sap.syncStyleClass(C,P,e);}P.addDependent(P);return e;};return D;}function b(v,A){var s,D,B,e;var f={onMessageDialogClose:function(){B.setVisible(false);e.navigateBack();D.close();r();},onBackButtonPress:function(){B.setVisible(false);e.navigateBack();},onMessageSelect:function(){B.setVisible(true);},getGroupName:function(u){var E,w,x,y,H,G,T;var z=D.getModel();var I=z.getMetaModel();if(!u){return l.getText("GENERAL_TITLE");}if(u.lastIndexOf("/")>0){u=u.substring(0,u.lastIndexOf("/"));}E=u.substring(1,u.indexOf('('));w=E&&I.getODataEntitySet(E);x=w&&I.getODataEntityType(w.entityType);H=x&&x["com.sap.vocabularies.UI.v1.HeaderInfo"];T=H&&H.Title&&H.Title.Value&&H.Title.Value.Path;y=z.getProperty(u);G=y&&y[T];return G?G:l.getText("GENERAL_TITLE");}};var t=g();var l=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app");if(t.length===0){return false;}else if(t.length===1&&t[0].type===V.Success){M.show(t[0].message,{onClose:r});}else{if(typeof v=="function"){D=v("sap.ui.generic.app.fragments.MessageDialog",f);}else if(typeof v=="object"){D=c(v.owner,v.contentDensityClass)("sap.ui.generic.app.fragments.MessageDialog",f);}else{return undefined;}var C=D.getAggregation("customHeader");var B=C.getContentLeft()[0];var e=D.getAggregation("content")[0];var j=sap.ui.getCore().getMessageManager().getMessageModel();D.setModel(j,"message");var k=D.getContent()[0];var n=k.getBinding("items");n.filter(new F("persistent",a.EQ,true));var S=new sap.ui.model.json.JSONModel();D.setModel(S,"settings");S.setProperty("/closeButtonText",l.getText("DIALOG_CLOSE"));for(var i=0;i<t.length;i++){var q=t[i];if(q.type===sap.ui.core.MessageType.Error){s=sap.ui.core.ValueState.Error;break;}if(q.type===sap.ui.core.MessageType.Warning){s=sap.ui.core.ValueState.Warning;continue;}if(q.type===sap.ui.core.MessageType.Information||q.type===sap.ui.core.MessageType.None){s=sap.ui.core.ValueState.None;continue;}s=sap.ui.core.ValueState.Success;}S.setProperty("/state",s);if(A){S.setProperty("/title",A);}else{S.setProperty("/title",l.getText("DIALOG_TITLE"));}D.open();}}function r(){var e=sap.ui.getCore().getMessageManager();var t=g();if(t.length>0){e.removeMessages(t);}}function d(s,D,e){var t=new sap.ui.core.message.Message({message:s,description:D,type:sap.ui.core.MessageType.Error,processor:e,target:'',persistent:true});sap.ui.getCore().getMessageManager().addMessages(t);}function p(e){var R;m=e&&e.url;if(m){m="/"+m.substring(0,m.indexOf(")")+1);}var s=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ERROR_UNKNOWN");var H;if(e instanceof Error){if(e.message){s=e.message;}}else if(e.response){if(e.response.message){s=e.response.message;}if(e.response.statusCode){H=e.response.statusCode;}if(e.response.headers){for(var f in e.response.headers){if(f.toLowerCase()==="content-type"){var i=e.response.headers[f];if(i.toLowerCase().indexOf("application/json")===0){if(e.response.responseText){var O=JSON.parse(e.response.responseText);if(O&&O.error&&O.error.message&&O.error.message.value){s=O.error.message.value;}}}else if(e.message){s=e.message;}break;}}}}var t=g(e);R={httpStatusCode:H,messageText:s,description:null,containsTransientMessage:(t.length===0)?false:true};return R;}return{operations:o,httpStatusCodes:h,handleTransientMessages:b,removeTransientMessages:r,addTransientErrorMessage:d,parseErrorResponse:p};},true);
