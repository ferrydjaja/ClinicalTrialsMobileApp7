sap.ui.define(["sap/ui/core/mvc/Controller", './Formatter',], function(Controller) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.List", {
        handleRouteMatched: function(oEvent) {
            var oParams = {};

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;
                var oPath;
                if (this.sContext) {
                    oPath = {
                        path: "/" + this.sContext,
                        parameters: oParams
                    };
                    this.getView().bindObject(oPath);
                }
            }

        },

        onInit: function() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            var oView = this.getView();

            this.getView().addEventDelegate({
                onBeforeShow: function(evt) {
                    var oModel = sap.ui.getCore().getModel();
                    console.log(oModel);
                    oView.setModel(oModel);

                    var oModelPath = new sap.ui.model.json.JSONModel(oModel);
                    sap.ui.getCore().setModel(oModelPath, "pathmodel");

                    this.oVBI = oView.byId("vbi");

                    var oMapConfig = {
                        "MapProvider": [{
                            "type": "",
                            "name": "BING",
                            "description": "Bing",
                            "tileX": "256",
                            "tileY": "256",
                            "minLOD": "0",
                            "maxLOD": "19",
                            "copyright": "Microsoft Corp.",
                            "Source": [{
                                "id": "1",
                                "url": "https://ecn.t0.tiles.virtualearth.net/tiles/r{QUAD}?g=685&&shading=hill"
                            }]
                        }],
                        "MapLayerStacks": [{
                            "name": "Default",
                            "MapLayer": [{
                                "name": "layer1",
                                "refMapProvider": "BING",
                                "opacity": "1.0",
                                "colBkgnd": "RGB(255,255,255)"
                            }]
                        }]
                    };

                    this.oVBI.setMapConfiguration(oMapConfig);
                    this.oVBI.setCenterPosition(oModel.oData.modelData[0].CenterPosition);

                }
            });
        },

        Search: function(oEvent) {
            var searchValue = oEvent.oSource.mProperties.value;

            var filters = new Array();
            var filter1 = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter2 = new sap.ui.model.Filter("nct_id", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter3 = new sap.ui.model.Filter("condition_summary", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter4 = new sap.ui.model.Filter("status/_", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter5 = new sap.ui.model.Filter("eligibility/gender", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter6 = new sap.ui.model.Filter("eligibility/minimum_age", sap.ui.model.FilterOperator.Contains, searchValue);

            var oCombinedOr = new sap.ui.model.Filter([filter1, filter2, filter3, filter4, filter5, filter6]);
            filters.push(oCombinedOr);

            //get list created in view
            this.oList = this.getView().byId("polist");
            this.oList.getBinding("items").filter(filters);
        },


        NavBack: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home", true);
        },

		onNavButtonTo: function (evt) {
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", true);
		},

        handleOnPress: function(oEvent) {
            var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({
                text: "{i18n>MSG0}",
                title: "{i18n>MSG1}"
            });

            function wasteTime() {
                busyDialog.open();
            }

            function runNext() {
                busyDialog.close();
            }

            function genCriteria(str) {
                var indices = [];
                var inclusionstr_final = '';
                var exclusionstr_final = '';
                var ic_s = str.search(/inclusion criteria:/i);
                var ic_e = str.search(/exclusion criteria:/i);

                //console.log(ic_s + ' ' + ic_e);

                if (ic_s != -1) {
                    //******* INCLUSION ***********************************
                    //Inclusion Criteria: 19 chars.

                    var inclusionstr = '';
                    if (ic_e == -1)
                        inclusionstr = str.substring(ic_s, str.length).trim();
                    else
                        inclusionstr = str.substring(ic_s, ic_e).trim();

                    if (!inclusionstr.startsWith("-")) {
                        inclusionstr = "- " + inclusionstr;
                    }
                    //console.log("Inclusionnstr: " + inclusionstr);

                    var indices = [];
                    var period = false;
                    for (var v = 0, len = inclusionstr.length; v < len; v++) {
                        if (inclusionstr[v] == "-" && inclusionstr[v + 2] != "-" && inclusionstr[v - 1] == " ") {
                            indices.push(v + 1);
                            period = false;
                        } else if (inclusionstr[v] == "." && inclusionstr[v + 1] == " " && inclusionstr[v + 2] != "-" && inclusionstr[v - 1] != "e" && inclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        } else if (inclusionstr[v] == ")" && inclusionstr[v - 2] == " " && inclusionstr[v + 1] == " " && inclusionstr[v + 2] != "-" && inclusionstr[v - 1] != "e" && inclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        }
                    }

                    var st = 0;
                    var et = 0;
                    for (var i = 0, len = indices.length; i < len; i++) {
                        st = indices[i];
                        et = indices[i + 1];

                        if (typeof et === 'undefined')
                            et = inclusionstr.length;
                        else {
                            if (period) {
                                et = et - 3;
                            } else
                                et = et - 2;
                        }

                        if (inclusionstr.substring(st, et) != '')
                            inclusionstr_final += '• ' + inclusionstr.substring(st, et) + '\n\n';
                    }
                    //console.log(inclusionstr_final);
                } else
                    inclusionstr_final = 'N/A';

                if (ic_e != -1) {
                    //******* EXCLUSION ***********************************
                    var exclusionstr = str.substring(ic_e, str.length);
                    //console.log("Exclusionstr: " + exclusionstr);


                    indices = [];
                    period = false;
                    for (var v = 0, len = exclusionstr.length; v < len; v++) {
                        if (exclusionstr[v] == "-" && exclusionstr[v + 2] != "-" && exclusionstr[v - 1] == " ") {
                            indices.push(v + 1);
                            period = false;
                        } else if (exclusionstr[v] == "." && exclusionstr[v + 1] == " " && exclusionstr[v + 2] != "-" && exclusionstr[v - 1] != "e" && exclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        } else if (exclusionstr[v] == ")" && exclusionstr[v - 2] == " " && exclusionstr[v + 1] == " " && exclusionstr[v + 2] != "-" && exclusionstr[v - 1] != "e" && exclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        }
                    }

                    var st = 0;
                    et = 0;
                    for (var i = 0, len = indices.length; i < len; i++) {
                        st = indices[i];
                        et = indices[i + 1];

                        if (typeof et === 'undefined')
                            et = exclusionstr.length;
                        else {
                            if (period) {
                                et = et - 3;
                            } else
                                et = et - 1;
                        }

                        if (exclusionstr.substring(st, et) != '')
                            exclusionstr_final += '• ' + exclusionstr.substring(st, et) + '\n\n';
                    }
                    //console.log(exclusionstr_final);
                } else
                    exclusionstr_final = 'N/A';

                indices = [];
                indices.push(inclusionstr_final);
                indices.push(exclusionstr_final);

                return indices;
            }


            var data = {};
            data.context = oEvent.getSource().getBindingContext();
            var selectedIndex = data.context.sPath.split("/")[4];

            var nct_id = data.context.oModel.oData.modelData[0].results[selectedIndex].nct_id;
            wasteTime();

            var position = '';

            var oModel = new sap.ui.model.json.JSONModel();

            var oGModel = sap.ui.getCore().getModel();
            var lat = oGModel.oData.UserLoc[0].split(";")[0];
            var lng = oGModel.oData.UserLoc[0].split(";")[1];


			var this_ = this;

            $.ajax({
                type: 'GET',
                async: true,
                cache: true,
                url: "/nodejs?q=2&nctid=" + nct_id + "&lat=" + lat + "&lng=" + lng,
                timeout: 600000, 
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                //url: "/nodejs?q=2&nctid=NCT01689584",
                //url: "http://10.44.136.115/nodejs?q=2&nctid=" + nct_id,

                success: function(data) {
                    if (data.results.length > 0) {
                        runNext();
                        console.log(data);

                        runNext();

                        var summarizer = new JsSummarize({
                            returnCount: 8
                        });
                        var detailed_description = summarizer.summarize("", data.results[0].detailed_description);
                        var detailed_descriptions = '';

                        if (detailed_description == '')
                            detailed_description = data.results[0].detailed_description;
                        else {
                            if (detailed_description.length > 0) {
                                for (var i = 0, len = detailed_description.length; i < len; i++) {
                                    detailed_descriptions += "• " + detailed_description[i] + "\n\n";
                                }
                                detailed_description = detailed_descriptions;
                            }
                        }


                        var url = data.results[0].url;
                        var brief_title = data.results[0].brief_title;
                        var official_title = data.results[0].official_title;
                        var brief_summary = data.results[0].brief_summary;
                        var country = data.results[0].country;
                        var last_update_submitted = data.results[0].last_update_submitted;
                        var last_name = data.results[0].last_name;
                        var phone = data.results[0].phone;
                        var email = data.results[0].email;
                        var position = data.Spots[0].pos;

                        var location; var locationAr = [];
                        if(typeof data.results[0].location.length === 'undefined') {
                            locationAr.push(data.results[0].location);
                            location = locationAr;
                        } else
                            location = data.results[0].location;
                        
                        console.log(location);

                        var Spots = data.Spots;
                        
                        var eligibility = data.results[0].eligibility;
                        var criteria = genCriteria(data.results[0].eligibility.criteria.textblock);
                        var inclusioncriteria = criteria[0];
                        var exclusioncriteria = criteria[1];
                        //console.log(inclusioncriteria);
                        //console.log(exclusioncriteria);
                        var centerposition = data.results[0].centerposition;


                        var obj = [{
                            nct_id: nct_id,
                            url: url,
                            brief_title: brief_title,
                            official_title: official_title,
                            brief_summary: brief_summary,
                            country: country,
                            //state: state,
                            detailed_description: detailed_description,
                            last_update_submitted: last_update_submitted,
                            last_name: last_name,
                            phone: phone,
                            email: email,
                            eligibility: eligibility,
                            inclusioncriteria: inclusioncriteria,
                            exclusioncriteria: exclusioncriteria,
                            position: position,
                            location: location,
                            Spots: Spots,
                            centerposition: centerposition
                        }];
                        console.log(obj);

                        oModel.setData({
                            modelData1: obj
                        });

						sap.ui.getCore().setModel(oModel, "DModel");
                        this_.onNavButtonTo();

                    } else {
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(jQuery.sap.resources({
                            url: "i18n/i18n.properties"
                        }).getText("NO_INFO"), {
                            icon: sap.m.MessageBox.Icon.INFORMATION,
                            title: "{i18n>WELCOME_TITLE}",
                            actions: sap.m.MessageBox.Action.OK,
                            onClose: null,
                            //styleClass: ""                        
                        });
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    runNext();
                    if (errorThrown == '')
                        errorThrown = 'Cannot connect to the backend';
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(errorThrown, {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: "{i18n>WELCOME_TITLE}",
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                }
            });


        }


    });
});