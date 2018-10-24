/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/mdc/ResourceModel","sap/ui/core/mvc/Controller","sap/ui/model/Sorter","sap/ui/model/json/JSONModel"],function(R,C,S,J){"use strict";return C.extend("sap.ui.mdc.internal.table.viewsettings.ViewSettings",{onConfirm:function(e){var c=e.getParameters(),s=[],p,d,k,n;var g=function(o){p=(c.groupItem&&c.groupItem.getKey());k=o.getProperty(p);n=c.groupItem&&c.groupItem.getText();return{key:k,text:n+" : "+k};};if(c.groupItem){p=c.groupItem.getKey();d=!!(c.groupDescending);var G=new S(p,d,g);s.push(G);}if(c.sortItem){p=c.sortItem.getKey();d=!!(c.sortDescending);s.push(new S(p,d));}this._saveViewSettingsState(c);this.oTableController.applyGroupAndSort(s);this.getView().destroy();},_saveViewSettingsState:function(c){var v=this.oView.getModel().getData();var g=c.groupItem&&c.groupItem.getKey();v.groupDescending=!!(c.groupDescending);if(g!=null&&g!=undefined){v.groupPanelItems.map(function(a){if(a.columnKey===g){a.selected=true;return a;}else{a.selected=false;return a;}});}var s=c.sortItem&&c.sortItem.getKey();v.sortDesecending=!!(c.sortDescending);if(s!=null&&s!=undefined){v.sortPanelItems.map(function(a){if(a.columnKey===s){a.selected=true;return a;}else{a.selected=false;return a;}});}this.oTableController.oViewSettingsPropertyModel=new J(v);},onCancel:function(e){this.getView().destroy();},onColumnListSelectAll:function(e){if(e.getParameters().selected){this.getView().byId("ColumnsList").selectAll();}else{this.getView().byId("ColumnsList").removeSelections(true);}this._updateSelectAllText();},onColumnListChange:function(e){this._updateSelectAllText();},_updateSelectAllText:function(){var c=this.getView().byId("ColumnsList"),s=R.getText("table.VIEWSETTINGS_COLUMN_SELECTALL",[c.getSelectedItems().length,c.getItems().length]);this.getView().byId("selectAllCheckBox").setText(s);}});});
