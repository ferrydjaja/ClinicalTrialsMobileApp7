sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.Feedback", {
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

            /*this below code for get the JSON Model form Manifest.json file*/
			var this_ = this;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			function debounce(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this,
                        args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };
            
            var oSelectLocationAS = this.getView().byId("selectLocationAS");
			oSelectLocationAS.attachSuggest(debounce(function() {

				var searchkey = oSelectLocationAS.getValue();

				var jModel = new sap.ui.model.json.JSONModel();
				
				jModel.attachRequestCompleted(function(event) {
					var jResponse = event.getSource().getData();

					if(JSON.stringify(jResponse) != "{}") {
						console.log(jResponse);

						this_.getView().byId("selectLocationAS").setModel(jModel);

						var filters = [];
						filters = [
							new sap.ui.model.Filter([
								new sap.ui.model.Filter("label", function(sText) {
									return (sText || "").toUpperCase().indexOf(searchkey.toUpperCase()) > -1;
								})
							], false)
						];

						this_.getView().byId("selectLocationAS").getBinding("suggestionItems").filter(filters)
						this_.getView().byId("selectLocationAS").suggest();
					}

				}.bind(this));

				jModel.loadData("/nodejs?q=4", {
					"input": searchkey
				}, false);
			}, 500));

			var oModelSponsor = this.getOwnerComponent().getModel("SponsorModel");
            this.getView().byId("selectSponsorAS").setModel(oModelSponsor);

            var oModelTrialStatus = this.getOwnerComponent().getModel("TrialStatusModel");
            this.getView().byId("selectTrialStatusAS").setModel(oModelTrialStatus);

            var oSelectConditionAS = this.getView().byId("selectConditionAS");

			/*
			oSelectConditionAS.attachSearch(debounce(function() {
				var searchkey = oSelectConditionAS.getValue()

			}, 500));
			*/

			oSelectConditionAS.attachSuggest(debounce(function() {

				var searchkey = oSelectConditionAS.getValue();

				var jModel = new sap.ui.model.json.JSONModel();
				
				jModel.attachRequestCompleted(function(event) {
					var jResponse = event.getSource().getData();

					if(JSON.stringify(jResponse) != "{}") {
						console.log(jResponse);

						this_.getView().byId("selectConditionAS").setModel(jModel);

						var filters = [];
						filters = [
							new sap.ui.model.Filter([
								new sap.ui.model.Filter("", function(sText) {
									return (sText || "").toUpperCase().indexOf(searchkey.toUpperCase()) > -1;
								})
							], false)
						];

						this_.getView().byId("selectConditionAS").getBinding("suggestionItems").filter(filters)
						this_.getView().byId("selectConditionAS").suggest();
					}

				}.bind(this));

				jModel.loadData("/nodejs?q=3", {
					"cond": searchkey
				}, false);
			}, 500));

            var oRootPath = jQuery.sap.getModulePath("ClinicalTrials.ClinicalTrials"); // your resource root
            var oImageModel = new sap.ui.model.json.JSONModel({
                path : oRootPath,
            });
                    
            this.getView().setModel(oImageModel, "imageModel");
        },

		onSelectSponsorChange: function(oEvent) {},
      
        onSelectTrialStatusChange: function(oEvent) {},

        _onRadioButtonGroupSelect: function() {

        },

		onNavButtonTo: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("list", true);
		},

		
        onButtonPress1: function(oEvent) {
            navigator.geolocation.getCurrentPosition(this.onGeoSuccess.bind(this), this.onGeoError.bind(this), {
                enableHighAccuracy: true, timeout: 2000, maximumAge: 0
            });
        },


        //onGeoSuccess: function(position) {
        onButtonPress: function() {
            var lat = '';
            var lng = '';

            //var lat = position.coords.latitude;
            //var lng = position.coords.longitude;
            //var alt = position.coords.altitude;

            this.onProcess(lat, lng);
        },

        onGeoError: function() {
            var lat = '';
            var lng = '';
            this.onProcess(lat, lng);
        },

        onProcess: function(lat, lng) {

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

            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            var cond = this.getView().byId("selectConditionAS").getValue().trim();
            var location = this.getView().byId("selectLocationAS").getValue().trim();
            var gndr = this.getView().byId("selectGenderAS").getSelectedIndex();
            var gndrAr = ['All', 'Male', 'Female'];
            gndr = gndrAr[gndr];
			var lead = this.getView().byId("selectSponsorAS").getSelectedKey().trim();
            var recrs = this.getView().byId("selectTrialStatusAS").getSelectedKey().trim();
            var age = this.getView().byId("selectAgeAS").getSelectedIndex();
            var ageAr = ['', '0', '1', '2'];
            age = ageAr[age];		
            var dist = 10676;
			var cntry;
			var state; 
			var city;

			var countryISOMapping = {
				AFG: "AF",
				ALA: "AX",
				ALB: "AL",
				DZA: "DZ",
				ASM: "AS",
				AND: "AD",
				AGO: "AO",
				AIA: "AI",
				ATA: "AQ",
				ATG: "AG",
				ARG: "AR",
				ARM: "AM",
				ABW: "AW",
				AUS: "AU",
				AUT: "AT",
				  AZE: "AZ",
				  BHS: "BS",
				  BHR: "BH",
				  BGD: "BD",
				  BRB: "BB",
				  BLR: "BY",
				  BEL: "BE",
				  BLZ: "BZ",
				  BEN: "BJ",
				  BMU: "BM",
				  BTN: "BT",
				  BOL: "BO",
				  BIH: "BA",
				  BWA: "BW",
				  BVT: "BV",
				  BRA: "BR",
				  VGB: "VG",
				  IOT: "IO",
				  BRN: "BN",
				  BGR: "BG",
				  BFA: "BF",
				  BDI: "BI",
				  KHM: "KH",
				  CMR: "CM",
				  CAN: "CA",
				  CPV: "CV",
				  CYM: "KY",
				  CAF: "CF",
				  TCD: "TD",
				  CHL: "CL",
				  CHN: "CN",
				  HKG: "HK",
				  MAC: "MO",
				  CXR: "CX",
				  CCK: "CC",
				  COL: "CO",
				  COM: "KM",
				  COG: "CG",
				  COD: "CD",
				  COK: "CK",
				  CRI: "CR",
				  CIV: "CI",
				  HRV: "HR",
				  CUB: "CU",
				  CYP: "CY",
				  CZE: "CZ",
				  DNK: "DK",
				  DJI: "DJ",
				  DMA: "DM",
				  DOM: "DO",
				  ECU: "EC",
				  EGY: "EG",
				  SLV: "SV",
				  GNQ: "GQ",
				  ERI: "ER",
				  EST: "EE",
				  ETH: "ET",
				  FLK: "FK",
				  FRO: "FO",
				  FJI: "FJ",
				  FIN: "FI",
				  FRA: "FR",
				  GUF: "GF",
				  PYF: "PF",
				  ATF: "TF",
				  GAB: "GA",
				  GMB: "GM",
				  GEO: "GE",
				  DEU: "DE",
				  GHA: "GH",
				  GIB: "GI",
				  GRC: "GR",
				  GRL: "GL",
				  GRD: "GD",
				  GLP: "GP",
				  GUM: "GU",
				  GTM: "GT",
				  GGY: "GG",
				  GIN: "GN",
				  GNB: "GW",
				  GUY: "GY",
				  HTI: "HT",
				  HMD: "HM",
				  VAT: "VA",
				  HND: "HN",
				  HUN: "HU",
				  ISL: "IS",
				  IND: "IN",
				  IDN: "ID",
				  IRN: "IR",
				  IRQ: "IQ",
				  IRL: "IE",
				  IMN: "IM",
				  ISR: "IL",
				  ITA: "IT",
				  JAM: "JM",
				  JPN: "JP",
				  JEY: "JE",
				  JOR: "JO",
				  KAZ: "KZ",
				  KEN: "KE",
				  KIR: "KI",
				  PRK: "KP",
				  KOR: "KR",
				  KWT: "KW",
				  KGZ: "KG",
				  LAO: "LA",
				  LVA: "LV",
				  LBN: "LB",
				  LSO: "LS",
				  LBR: "LR",
				  LBY: "LY",
				  LIE: "LI",
				  LTU: "LT",
				  LUX: "LU",
				  MKD: "MK",
				  MDG: "MG",
				  MWI: "MW",
				  MYS: "MY",
				  MDV: "MV",
				  MLI: "ML",
				  MLT: "MT",
				  MHL: "MH",
				  MTQ: "MQ",
				  MRT: "MR",
				  MUS: "MU",
				  MYT: "YT",
				  MEX: "MX",
				  FSM: "FM",
				  MDA: "MD",
				  MCO: "MC",
				  MNG: "MN",
				  MNE: "ME",
				  MSR: "MS",
				  MAR: "MA",
				  MOZ: "MZ",
				  MMR: "MM",
				  NAM: "NA",
				  NRU: "NR",
				  NPL: "NP",
				  NLD: "NL",
				  ANT: "AN",
				  NCL: "NC",
				  NZL: "NZ",
				  NIC: "NI",
				  NER: "NE",
				  NGA: "NG",
				  NIU: "NU",
				  NFK: "NF",
				  MNP: "MP",
				  NOR: "NO",
				  OMN: "OM",
				  PAK: "PK",
				  PLW: "PW",
				  PSE: "PS",
				  PAN: "PA",
				  PNG: "PG",
				  PRY: "PY",
				  PER: "PE",
				  PHL: "PH",
				  PCN: "PN",
				  POL: "PL",
				  PRT: "PT",
				  PRI: "PR",
				  QAT: "QA",
				  REU: "RE",
				  ROU: "RO",
				  RUS: "RU",
				  RWA: "RW",
				  BLM: "BL",
				  SHN: "SH",
				  KNA: "KN",
				  LCA: "LC",
				  MAF: "MF",
				  SPM: "PM",
				  VCT: "VC",
				  WSM: "WS",
				  SMR: "SM",
				  STP: "ST",
				  SAU: "SA",
				  SEN: "SN",
				  SRB: "RS",
				  SYC: "SC",
				  SLE: "SL",
				  SGP: "SG",
				  SVK: "SK",
				  SVN: "SI",
				  SLB: "SB",
				  SOM: "SO",
				  ZAF: "ZA",
				  SGS: "GS",
				  SSD: "SS",
				  ESP: "ES",
				  LKA: "LK",
				  SDN: "SD",
				  SUR: "SR",
				  SJM: "SJ",
				  SWZ: "SZ",
				  SWE: "SE",
				  CHE: "CH",
				  SYR: "SY",
				  TWN: "TW",
				  TJK: "TJ",
				  TZA: "TZ",
				  THA: "TH",
				  TLS: "TL",
				  TGO: "TG",
				  TKL: "TK",
				  TON: "TO",
				  TTO: "TT",
				  TUN: "TN",
				  TUR: "TR",
				  TKM: "TM",
				  TCA: "TC",
				  TUV: "TV",
				  UGA: "UG",
				  UKR: "UA",
				  ARE: "AE",
				  GBR: "GB",
				  USA: "US",
				  UMI: "UM",
				  URY: "UY",
				  UZB: "UZ",
				  VUT: "VU",
				  VEN: "VE",
				  VNM: "VN",
				  VIR: "VI",
				  WLF: "WF",
				  ESH: "EH",
				  YEM: "YE",
				  ZMB: "ZM",
				  ZWE: "ZW"
			}

			function getCountryISO2(countryCode) {
				return countryISOMapping[countryCode]
			}

            if (cond.length > 0) {
                wasteTime();
                var this_ = this;

				
				$.ajax({
                    type: 'GET',
                    async: true,
                    cache: true,
                    dataType: "json",
                    timeout: 600000, 
                    contentType: "application/json; charset=utf-8",
                    url: "/nodejs?q=5&location=" + location,
                    success: function(data) {
						runNext();
						console.log(data);

						console.log(data.Response.View.length);
						if(data.Response.View.length > 0) {
							cntry = data.Response.View[0].Result[0].Location.Address.Country;
							cntry = getCountryISO2(cntry);
							console.log(cntry);
						} else {
						}

						/*
						if(data.status == 'OK') {
							for (var v = 0, len = data.results[0].address_components.length; v < len; v++) {
								var type = data.results[0].address_components[v].types;
								if(type.includes("locality"))
									city = data.results[0].address_components[v].short_name;

								if(type.includes("administrative_area_level_1"))
									state = data.results[0].address_components[v].short_name;

								if(type.includes("country"))
									cntry = data.results[0].address_components[v].short_name;
							}
							if(typeof state === "undefined") 
								state = "";
							else {
								if(cntry == "US")
									state = "US:" + state;
							}

							if(typeof city === "undefined") 
								city = "";

						} 

						console.log(cond + '-' + cntry + '-' + state + '-' + city + '-' + gndr + '-' + lead + '-' + recrs + '-' + age + '-' + dist + '-' + lat + '-' + lng);

						$.ajax({
							type: 'GET',
							async: true,
							cache: true,
							dataType: "json",
							timeout: 600000, 
							contentType: "application/json; charset=utf-8",
							url: "/nodejs?q=1&cond=" + cond + "&cntry=" + cntry + "&state=" + state + "&city=" + city + "&recrs=" + recrs + "&gndr=" + gndr + "&age=" + age + "&dist=" + dist + "&lat=" + lat + "&lng=" + lng,
							success: function(data) {
								console.log(data);

								if (JSON.stringify(data) != "{}") {
									console.log(data.results.length);

									if (data.results.length > 0) {
										runNext();

										var oModel = new sap.ui.model.json.JSONModel();
										oModel.setData({});
										oModel.setSizeLimit(999999);

										oModel.setData({
											modelData: [data],
											UserLoc: [lat + ';' + lng],
											cond: [toTitleCase(cond)]
										});
										sap.ui.getCore().setModel(oModel);
										this_.onNavButtonTo();

									} else {
										runNext();
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
								} else {
									// No record {}
									runNext();
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
								jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(jQuery.sap.resources({
										url: "i18n/i18n.properties"
								}).getText("ERROR_INFO"), {
									   icon: sap.m.MessageBox.Icon.INFORMATION,
										title: "{i18n>WELCOME_TITLE}",
										actions: sap.m.MessageBox.Action.OK,
										onClose: null,
										//styleClass: ""                        
								});
							}
						});
						*/
					 },
                    error: function(jqXHR, textStatus, errorThrown) {
                        runNext();
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(jQuery.sap.resources({
                                url: "i18n/i18n.properties"
                        }).getText("ERROR_INFO"), {
                               icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: "{i18n>WELCOME_TITLE}",
                                actions: sap.m.MessageBox.Action.OK,
                                onClose: null,
                                //styleClass: ""                        
                        });
                    }
                });
				
            } else {
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.show(jQuery.sap.resources({
                    url: "i18n/i18n.properties"
                }).getText("VALID_KEYWORD"), {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: "{i18n>WELCOME_TITLE}",
                    actions: sap.m.MessageBox.Action.OK,
                    onClose: null,
                    //styleClass: ""                        
                });
            }
        }
    });
});