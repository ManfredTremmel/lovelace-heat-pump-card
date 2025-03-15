class HeatPumpCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      const localization = HeatPumpCard.readLocalization(hass);
      this.innerHTML = '<ha-card header="' + localization['header'] + '">\n' + HeatPumpCard.readSvg() + '</ha-card>';
      this.content = this.querySelector("svg");
      this.content.querySelector("#textTankWWName").innerHTML = localization.svgTexts['tankWWName'];
      this.content.querySelector("#textTankHPName").innerHTML = localization.svgTexts['tankHPName'];
      this.content.querySelector("#textEvaporator").innerHTML = localization.svgTexts['evaporator'];
      this.content.querySelector("#textCondenser").innerHTML = localization.svgTexts['condenser'];
      this.content.querySelector("#textCompressor").innerHTML = localization.svgTexts['compressor'];
      this.content.querySelector("#textExpansionValve").innerHTML = localization.svgTexts['expansionValve'];
      this.content.querySelector("#textCirculatingPump").innerHTML = localization.svgTexts['circulatingPump'];
      this.content.querySelector("#textHeatingCircuitPump").innerHTML = localization.svgTexts['heatingCircuitPump'];
      this.content.querySelector("#textSupplyTemperatureLabel").innerHTML = localization.svgTexts['supplyTemperatureLabel'];
      this.content.querySelector("#linkDetails").addEventListener("click", this.linkHandling);
      this.content.querySelector("#linkSettings").addEventListener("click", this.linkHandling);
      this.setLinks();
    }

    this.content.querySelector("#gHPStatusOff").style.display = this.formatBinary(hass.states[this.config.heatingPumpStatusOnOff]) ? "none" : "inline";
    this.content.querySelector("#gHPStatusWW").style.display = this.formatBinary(hass.states[this.config.heatingPumpHotWaterMode]) ? "inline" : "none";
    this.content.querySelector("#gHPStatusHeating").style.display = this.formatBinary(hass.states[this.config.heatingPumpHeatingMode]) ? "inline" : "none";
    this.content.querySelector("#gHPStatusCooling").style.display = this.formatBinary(hass.states[this.config.heatingPumpCoolingMode]) ? "inline" : "none";

    const heatingPumpPartyModeBoolean = this.formatBinary(hass.states[this.config.heatingPumpPartyMode]);
    this.content.querySelector("#gHPStatusParty").style.display = heatingPumpPartyModeBoolean ? "inline" : "none";

    this.content.querySelector("#gHPStatusSave").style.display = this.formatBinary(hass.states[this.config.heatingPumpEnergySaveMode]) ? "inline" : "none";

    const heatingPumpNightModeBoolean = this.formatBinary(hass.states[this.config.heatingPumpNightMode]);
    this.content.querySelector("#gTimeSymbolNight").style.display = heatingPumpNightModeBoolean ? "inline" : "none";
    this.content.querySelector("#gTimeSymbolDay").style.display = heatingPumpNightModeBoolean ? "none" : "inline";


    this.content.querySelector("#textOutdoorTemperatureValue").innerHTML = this.formatNum(hass.states[this.config.outdoorTemperature]);

    const ambientTemperatureNormalState = hass.states[this.config.ambientTemperatureNormal];
    const ambientTemperatureReducedState = hass.states[this.config.ambientTemperatureReduced];
    const ambientTemperaturePartyState = hass.states[this.config.ambientTemperatureParty];
    if (heatingPumpPartyModeBoolean && ambientTemperaturePartyState) {
      this.content.querySelector("#textIndoorTemperatureValue").innerHTML = this.formatNum(ambientTemperaturePartyState);
    } else if (heatingPumpNightModeBoolean && ambientTemperatureReducedState) {
      this.content.querySelector("#textIndoorTemperatureValue").innerHTML = this.formatNum(ambientTemperatureReducedState);
    } else {
      this.content.querySelector("#textIndoorTemperatureValue").innerHTML = this.formatNum(ambientTemperatureNormalState);
    }

    this.content.querySelector("#textSupplyTemperatureValue").innerHTML = this.formatNum(hass.states[this.config.supplyTemperature]);


    this.content.querySelector("#animationHPFan").setAttribute(
      'to', (this.formatBinary(hass.states[this.config.hpRunning]) ? '360' : '0') + ' 225 485');

    this.content.querySelector("#animationCompressor").setAttribute(
      'to', (this.formatBinary(hass.states[this.config.compressorRunning]) ? '360' : '0') + ' 389 378');

    this.content.querySelector("#animationHeatingCircuitPumpBladeWheel").setAttribute(
      'to', (this.formatBinary(hass.states[this.config.heatingCircuitPumpRunning]) ? '360' : '0') + ' 935 204');

    this.content.querySelector("#animationCirculatingPumpBladeWheel").setAttribute(
      'to', (this.formatBinary(hass.states[this.config.circulatingPumpRunning]) ? '360' : '0') + ' 935 504');


    const tankTempHPUpState = hass.states[this.config.tankTempHPUp];
    this.content.querySelector("#textTankTempHPUp").innerHTML = this.formatNum(tankTempHPUpState);

    const tankTempHPMiddleState = hass.states[this.config.tankTempHPMiddle];
    this.content.querySelector("#textTankTempHPMiddle").innerHTML = this.formatNum(tankTempHPMiddleState);

    const tankTempHPDownState = hass.states[this.config.tankTempHPDown];
    this.content.querySelector("#textTankTempHPDown").innerHTML = this.formatNum(tankTempHPDownState);

    this.tankColors(this.content, tankTempHPUpState, tankTempHPMiddleState, tankTempHPDownState, "#stop3020", "#stop3040", "#stop3030");


    const tankTempWWUpState = hass.states[this.config.tankTempWWUp];
    this.content.querySelector("#textTankTempWWUp").innerHTML = this.formatNum(tankTempWWUpState);

    const tankTempWWMiddleState = hass.states[this.config.tankTempWWMiddle];
    this.content.querySelector("#textTankTempWWMiddle").innerHTML = this.formatNum(tankTempWWMiddleState);

    const tankTempWWDownState = hass.states[this.config.tankTempWWDown];
    this.content.querySelector("#textTankTempWWDown").innerHTML = this.formatNum(tankTempWWDownState);

    this.tankColors(this.content, tankTempWWUpState, tankTempWWMiddleState, tankTempWWDownState, "#stop3050", "#stop3070", "#stop3060");


    this.content.querySelector("#textSupplyTemperatureHeating").innerHTML = this.formatNum(hass.states[this.config.supplyTemperatureHeating]);
    this.content.querySelector("#textRefluxTemperatureHeating").innerHTML = this.formatNum(hass.states[this.config.refluxTemperatureHeating]);

    this.content.querySelector("#textEvaporatorPressure").innerHTML = this.formatNum(hass.states[this.config.evaporatorPressure]);
    this.content.querySelector("#textEvaporatorTemperature").innerHTML = this.formatNum(hass.states[this.config.evaporatorTemperature]);
    this.content.querySelector("#textCondenserPressure").innerHTML = this.formatNum(hass.states[this.config.condenserPressure]);

    this.content.querySelector("#gWWHeatingValve").setAttribute('transform',
      'rotate(' + (this.formatBinary(hass.states[this.config.wwHeatingValve]) ? '90' : '0') + ', 750, 357)');


    const heaterRodWWBoolean = this.formatBinary(hass.states[this.config.heaterRodWW]);
    this.content.querySelector("#pathHeaterRodWW").style.display = heaterRodWWBoolean ? 'block' : 'none';
    this.content.querySelector("#pathHeaterRodHP").style.display = this.formatBinary(hass.states[this.config.heaterRodHP]) ? 'block' : 'none';

    this.heaterRodColor(this.content, heaterRodWWBoolean, this.formatBinary(hass.states[this.config.heaterRodLevel1]),
                       this.formatBinary(hass.states[this.config.heaterRodLevel2]));
  }

  static cardFolder = "/hacsfiles/heat-pump-card/heat-pump-card/";
  static cardFolderAlternate = "/hacsfiles/lovelace-heat-pump-card/heat-pump-card/";

  static readLocalization(hass) {
    var translationJSONobj = HeatPumpCard.readLocalizationLang(hass.language.substring(0,2), HeatPumpCard.cardFolder);
    if (!translationJSONobj) {
      translationJSONobj = HeatPumpCard.readLocalizationLang("en", HeatPumpCard.cardFolder);
    }
    if (!translationJSONobj) {
      translationJSONobj = HeatPumpCard.readLocalizationLang(hass.language.substring(0,2), HeatPumpCard.cardFolderAlternate);
    }
    if (!translationJSONobj) {
      translationJSONobj = HeatPumpCard.readLocalizationLang("en", HeatPumpCard.cardFolderAlternate);
    }
    return translationJSONobj;
  }

  static readLocalizationLang(lang, folder) {
    var translationLocal = folder + lang + ".json";
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", translationLocal, false);
    rawFile.send(null);
    if (rawFile.status == 200) {
      return JSON.parse(rawFile.responseText);
    }
    return null;
  }

  static readSvg() {
    var svgObj = HeatPumpCard.readSvgFolder(HeatPumpCard.cardFolder);
    if (!svgObj) {
      svgObj = HeatPumpCard.readSvgFolder(HeatPumpCard.cardFolderAlternate);
    }
    return svgObj;
  }

  static readSvgFolder(folder) {
    var svgImage = folder + "heat-pump.svg";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", svgImage, false);
    rawFile.send(null);
    if (rawFile.status == 200) {
      return rawFile.responseText;
    }
    return null;
  }

  setLinks() {
    if (this.content && this.config) {
      this.content.querySelector("#linkDetails").setAttribute('href', this.config.linkDetails);
      this.content.querySelector("#linkSettings").setAttribute('href', this.config.linkSettings);
    }
  }

  formatBinary(state) {
    return state && state.state  === "on";
  }

  formatNum(state) {
    if (state) {
      return new Intl.NumberFormat(undefined, {minimumFractionDigits: 1}).format(state.state) + " " + state.attributes.unit_of_measurement;
    }
    return null;
  }

  heaterRodColor(content, heaterRodWW, heaterRodLevel1, heaterRodLevel2) {
    var colorHS = "#ffffff";
    if (heaterRodLevel1) {
      colorHS = this.tempColor(40);
    } else if (heaterRodLevel2) {
      colorHS = this.tempColor(60);
    }
    if (heaterRodWW) {
      content.querySelector("#pathHeaterRodWW").style.stroke = colorHS;
      content.querySelector("#pathHeaterRodHP").style.stroke = "#ffffff";
    } else {
      content.querySelector("#pathHeaterRodHP").style.stroke = colorHS;
      content.querySelector("#pathHeaterRodWW").style.stroke = "#ffffff";
    }
  }

  tempColor(temp) {
    if (temp > 60) {
      return "#ff0000"
    }
    return "#" + ("0" + Math.round(255 * temp / 60).toString(16)).substr(-2) + "00" + ("0" + Math.round(255 * Math.abs(60 - temp) / 60).toString(16)).substr(-2);
  }

  tankColors(content, tankTempUp, tankTempMiddle, tankTempDown, idUp, idMiddle, idDown) {
    var tempUp = tankTempUp ? tankTempUp.state : 0;
    var tempMiddle = Math.max(0, tankTempMiddle ? tankTempMiddle.state : tempUp - 5);
    var tempDown = Math.max(0, tankTempDown ? tankTempDown.state : tempMiddle - 5);
    content.querySelector(idUp).setAttribute('style', "stop-color:" + this.tempColor(tempUp));
    content.querySelector(idMiddle).setAttribute('style', "stop-color:" + this.tempColor(tempMiddle));
    content.querySelector(idDown).setAttribute('style', "stop-color:" + this.tempColor(tempDown));
  }

  linkHandling(event) {
    event.preventDefault();
    window.history.pushState(null,"",this.getAttribute('href'));
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.heatingPumpStatusOnOff) {
      throw new Error("You need to define heatingPumpStatusOnOff");
    }
    if (!config.heatingPumpHotWaterMode) {
      throw new Error("You need to define heatingPumpHotWaterMode");
    }
    if (!config.heatingPumpHeatingMode) {
      throw new Error("You need to define heatingPumpHeatingMode");
    }

    if (!config.outdoorTemperature) {
      throw new Error("You need to define outdoorTemperature");
    }
    if (!config.ambientTemperatureNormal) {
      throw new Error("You need to define ambientTemperatureNormal");
    }

    if (!config.hpRunning) {
      throw new Error("You need to define hpRunning");
    }
    if (!config.compressorRunning) {
      throw new Error("You need to define compressorRunning");
    }
    if (!config.heatingCircuitPumpRunning) {
      throw new Error("You need to define heatingCircuitPumpRunning");
    }
    if (!config.circulatingPumpRunning) {
      throw new Error("You need to define circulatingPumpRunning");
    }

    if (!config.tankTempHPUp) {
      throw new Error("You need to define tankTempHPUp");
    }
    if (!config.tankTempWWUp) {
      throw new Error("You need to define tankTempWWUp");
    }

    if (!config.supplyTemperatureHeating) {
      throw new Error("You need to define supplyTemperatureHeating");
    }

    if (!config.wwHeatingValve) {
      throw new Error("You need to define wwHeatingValve");
    }

    if (!config.linkDetails) {
      throw new Error("You need to define linkDetails");
    }

    if (!config.linkSettings) {
      throw new Error("You need to define linkSettings");
    }

    this.config = config;
    this.setLinks();
  }

  static getConfigElement() {
    return document.createElement("heat-pump-card-editor");
  }

  static getStubConfig() {
    return {
      heatingPumpStatusOnOff: "binary_sensor.heating_pump_status_on_off",
      heatingPumpHotWaterMode: "binary_sensor.heating_pump_hot_water_mode",
      heatingPumpHeatingMode: "binary_sensor.heating_pump_heating_mode",
      heatingPumpCoolingMode: "binary_sensor.heating_pump_cooling_mode",
      heatingPumpPartyMode: "binary_sensor.heating_pump_party_mode",
      heatingPumpEnergySaveMode: "binary_sensor.heating_pump_energy_save_mode",
      heatingPumpNightMode: "binary_sensor.heating_pump_night_mode",
      outdoorTemperature: "sensor.mosquitto_mqtt_broker_aussentemperatur",
      ambientTemperatureNormal: "number.mosquitto_mqtt_broker_raumsolltemperatur_normal",
      ambientTemperatureReduced: "number.mosquitto_mqtt_broker_raumsolltemperatur_reduziert",
      ambientTemperatureParty: "number.mosquitto_mqtt_broker_raumsolltemperatur_party",
      supplyTemperature: "sensor.mosquitto_mqtt_broker_information_allgemein_anlagenvorlauftemperatur_0_95",
      hpRunning: "binary_sensor.mosquitto_mqtt_broker_status_primaerquelle",
      compressorRunning: "binary_sensor.mosquitto_mqtt_broker_status_verdichter",
      heatingCircuitPumpRunning: "binary_sensor.mosquitto_mqtt_broker_information_heizkreis_hk2_heizkreispumpe_0_1",
      circulatingPumpRunning: "binary_sensor.mosquitto_mqtt_broker_status_zirklulationspumpe_2",
      tankTempHPUp: "sensor.mosquitto_mqtt_broker_information_allgemein_pufferspeichertemperatur_0_95",
      tankTempHPMiddle: "",
      tankTempHPDown: "",
      tankTempWWUp: "sensor.mosquitto_mqtt_broker_warmwassertemperatur_ist_oben",
      tankTempWWMiddle: "",
      tankTempWWDown: "",
      supplyTemperatureHeating: "sensor.mosquitto_mqtt_broker_information_heizkreis_hk2_vorlauftemperatur_sekundaer_2_0_95",
      refluxTemperatureHeating: "",
      evaporatorPressure: "sensor.mosquitto_mqtt_broker_druck_im_verdampfer",
      evaporatorTemperature: "sensor.mosquitto_mqtt_broker_temperatur_verdampfer",
      condenserPressure: "sensor.mosquitto_mqtt_broker_druck_im_kondensator",
      wwHeatingValve: "binary_sensor.mosquitto_mqtt_broker_diagnose_waermepumpe_3_w_ventil_heizen_ww1_0_heizen_1_ww",
      heaterRodWW: "switch.mosquitto_mqtt_broker_freigabe_elektroheizung_fuer_ww_bereitung",
      heaterRodHP: "switch.mosquitto_mqtt_broker_freigabe_heizen_mit_elektro",
      heaterRodLevel1: "binary_sensor.mosquitto_mqtt_broker_status_heizstab_stufe_1",
      heaterRodLevel2: "binary_sensor.mosquitto_mqtt_broker_status_heizstab_stufe_2",
      linkDetails: "./hp-details",
      linkSettings: "./hp-settings"
    };
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns in masonry view
  getCardSize() {
    return 7;
  }

  // The rules for sizing your card in the grid in sections view
  getLayoutOptions() {
    return {
      grid_rows: 7,
      grid_columns: 20,
      grid_min_rows: 3,
      grid_max_rows: 10,
    };
  }
}

customElements.define("heat-pump-card", HeatPumpCard);

class HeatPumpCardEditor extends HTMLElement {
  // private properties
  _config;
  _hass;
  _elements = {};
  _localization;

  // lifecycle
  constructor() {
    super();
    console.log("editor:constructor()");
    this.doEditor();
    this.doStyle();
    this.doAttach();
    this.doQueryElements();
    this.doListen();
  }

  setConfig(config) {
    console.log("editor:setConfig()");
    this._config = config;
    this.doUpdateConfig();
  }

  set hass(hass) {
    console.log("editor.hass()");
    this._hass = hass;
    this.doUpdateHass();
  }
  
  onChanged(event) {
    console.log("editor.onChanged()");
    this.doMessageForUpdate(event);
  }

  // jobs
  doEditor() {
    this._elements.editor = document.createElement("form");
    this._elements.editor.innerHTML = `
        <div class="row">
          <label class="label" id="heatingPumpStatusOnOffLabel" for="heatingPumpStatusOnOff">Heating Pump On/Off:</label>
          <input class="value" id="heatingPumpStatusOnOff"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingPumpHotWaterModeLabel" for="heatingPumpHotWaterMode">Hot Water Mode On/Off:</label>
          <input class="value" id="heatingPumpHotWaterMode"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingPumpHeatingModeLabel" for="heatingPumpHeatingMode">Heating Mode On/Off:</label>
          <input class="value" id="heatingPumpHeatingMode"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingPumpCoolingModeLabel" for="heatingPumpCoolingMode">Cooling Mode On/Off:</label>
          <input class="value" id="heatingPumpCoolingMode"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingPumpPartyModeLabel" for="heatingPumpPartyMode">Party Mode On/Off:</label>
          <input class="value" id="heatingPumpPartyMode"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingPumpEnergySaveModeLabel" for="heatingPumpEnergySaveMode">Energy Save Mode On/Off:</label>
          <input class="value" id="heatingPumpEnergySaveMode"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingPumpNightModeLabel" for="heatingPumpNightMode">Night Mode On/Off:</label>
          <input class="value" id="heatingPumpNightMode"></input>
        </div>
        <div class="row">
          <label class="label" id="outdoorTemperatureLabel" for="outdoorTemperature">Outdoor Temperature:</label>
          <input class="value" id="outdoorTemperature"></input>
        </div>
        <div class="row">
          <label class="label" id="ambientTemperatureNormalLabel" for="ambientTemperatureNormal">Ambient Temperature normal:</label>
          <input class="value" id="ambientTemperatureNormal"></input>
        </div>
        <div class="row">
          <label class="label" id="ambientTemperatureReducedLabel" for="ambientTemperatureReduced">Ambient Temperature reduced:</label>
          <input class="value" id="ambientTemperatureReduced"></input>
        </div>
        <div class="row">
          <label class="label" id="ambientTemperaturePartyLabel" for="ambientTemperatureParty">Ambient Temperature Party:</label>
          <input class="value" id="ambientTemperatureParty"></input>
        </div>
        <div class="row">
          <label class="label" id="supplyTemperatureLabel" for="supplyTemperature">Supply Temperature:</label>
          <input class="value" id="supplyTemperature"></input>
        </div>
        <div class="row">
          <label class="label" id="hpRunningLabel" for="hpRunning">Primary Source On/Off:</label>
          <input class="value" id="hpRunning"></input>
        </div>
        <div class="row">
          <label class="label" id="compressorRunningLabel" for="compressorRunning">Compressor running On/Off:</label>
          <input class="value" id="compressorRunning"></input>
        </div>
        <div class="row">
          <label class="label" id="heatingCircuitPumpRunningLabel" for="heatingCircuitPumpRunning">Heating Circuit Pump On/Off:</label>
          <input class="value" id="heatingCircuitPumpRunning"></input>
        </div>
        <div class="row">
          <label class="label" id="circulatingPumpRunningLabel" for="circulatingPumpRunning">Circulating Pump On/Off:</label>
          <input class="value" id="circulatingPumpRunning"></input>
        </div>
        <div class="row">
          <label class="label" id="tankTempHPUpLabel" for="tankTempHPUp">Buffer Temperature up:</label>
          <input class="value" id="tankTempHPUp"></input>
        </div>
        <div class="row">
          <label class="label" id="tankTempHPMiddleLabel" for="tankTempHPMiddle">Buffer Temperature middle:</label>
          <input class="value" id="tankTempHPMiddle"></input>
        </div>
        <div class="row">
          <label class="label" id="tankTempHPDownLabel" for="tankTempHPDown">Buffer Temperature down:</label>
          <input class="value" id="tankTempHPDown"></input>
        </div>
        <div class="row">
          <label class="label" id="tankTempWWUpLabel" for="tankTempWWUp">Hot Water Buffer Temperature up:</label>
          <input class="value" id="tankTempWWUp"></input>
        </div>
        <div class="row">
          <label class="label" id="tankTempWWMiddleLabel" for="tankTempWWMiddle">Hot Water Buffer Temperature middle:</label>
          <input class="value" id="tankTempWWMiddle"></input>
        </div>
        <div class="row">
          <label class="label" id="tankTempWWDownLabel" for="tankTempWWDown">Hot Water Buffer Temperature down:</label>
          <input class="value" id="tankTempWWDown"></input>
        </div>
        <div class="row">
          <label class="label" id="supplyTemperatureHeatingLabel" for="supplyTemperatureHeating">Supply Temperature Heating:</label>
          <input class="value" id="supplyTemperatureHeating"></input>
        </div>
        <div class="row">
          <label class="label" id="refluxTemperatureHeatingLabel" for="refluxTemperatureHeating">Reflux Temperature Heating:</label>
          <input class="value" id="refluxTemperatureHeating"></input>
        </div>
        <div class="row">
          <label class="label" id="evaporatorPressureLabel" for="evaporatorPressure">Evaporator Pressure:</label>
          <input class="value" id="evaporatorPressure"></input>
        </div>
        <div class="row">
          <label class="label" id="evaporatorTemperatureLabel" for="evaporatorTemperature">Evaporator Temperature:</label>
          <input class="value" id="evaporatorTemperature"></input>
        </div>
        <div class="row">
          <label class="label" id="condenserPressureLabel" for="condenserPressure">Condenser Pressure:</label>
          <input class="value" id="condenserPressure"></input>
        </div>
        <div class="row">
          <label class="label" id="wwHeatingValveLabel" for="wwHeatingValve">Heating/Hot Water Valve:</label>
          <input class="value" id="wwHeatingValve"></input>
        </div>
        <div class="row">
          <label class="label" id="heaterRodWWLabel" for="heaterRodWW">Heater Rod Hot Water On/Off:</label>
          <input class="value" id="heaterRodWW"></input></div>
        <div class="row">
          <label class="label" id="heaterRodHPLabel" for="heaterRodHP">Heater Rod Heating On/Off:</label>
          <input class="value" id="heaterRodHP"></input>
        </div>
        <div class="row">
          <label class="label" id="heaterRodLevel1Label" for="heaterRodLevel1">Heater Rod Level 1 On/Off:</label>
          <input class="value" id="heaterRodLevel1"></input>
        </div>
        <div class="row">
          <label class="label" id="heaterRodLevel2Label" for="heaterRodLevel2">Heater Rod Level 2 On/Off:</label>
          <input class="value" id="heaterRodLevel2"></input>
        </div>
        <div class="row">
          <label class="label" id="linkDetailsLabel" for="linkDetails">Link Details:</label>
          <input class="value" id="linkDetails"></input>
        </div>
        <div class="row">
          <label class="label" id="linkSettingsLabel" for="linkSettings">Link Settings:</label>
          <input class="value" id="linkSettings"></input>
        </div>
    `;
  }

  doStyle() {
    this._elements.style = document.createElement("style");
    this._elements.style.textContent = `
      form {
        display: table;
      }
      .row {
        display: table-row;
      }
      .label, .value {
        display: table-cell;
        padding: 0.5em;
      }
  `;
  }

  doAttach() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this._elements.style, this._elements.editor);
  }

  doQueryElements() {
    this._elements.heatingPumpStatusOnOff = this._elements.editor.querySelector("#heatingPumpStatusOnOff");
    this._elements.heatingPumpHotWaterMode = this._elements.editor.querySelector("#heatingPumpHotWaterMode");
    this._elements.heatingPumpHeatingMode = this._elements.editor.querySelector("#heatingPumpHeatingMode");
    this._elements.heatingPumpCoolingMode = this._elements.editor.querySelector("#heatingPumpCoolingMode");
    this._elements.heatingPumpPartyMode = this._elements.editor.querySelector("#heatingPumpPartyMode");
    this._elements.heatingPumpEnergySaveMode = this._elements.editor.querySelector("#heatingPumpEnergySaveMode");
    this._elements.heatingPumpNightMode = this._elements.editor.querySelector("#heatingPumpNightMode");
    this._elements.outdoorTemperature = this._elements.editor.querySelector("#outdoorTemperature");
    this._elements.ambientTemperatureNormal = this._elements.editor.querySelector("#ambientTemperatureNormal");
    this._elements.ambientTemperatureReduced = this._elements.editor.querySelector("#ambientTemperatureReduced");
    this._elements.ambientTemperatureParty = this._elements.editor.querySelector("#ambientTemperatureParty");
    this._elements.supplyTemperature = this._elements.editor.querySelector("#supplyTemperature");
    this._elements.hpRunning = this._elements.editor.querySelector("#hpRunning");
    this._elements.compressorRunning = this._elements.editor.querySelector("#compressorRunning");
    this._elements.heatingCircuitPumpRunning = this._elements.editor.querySelector("#heatingCircuitPumpRunning");
    this._elements.circulatingPumpRunning = this._elements.editor.querySelector("#circulatingPumpRunning");
    this._elements.tankTempHPUp = this._elements.editor.querySelector("#tankTempHPUp");
    this._elements.tankTempHPMiddle = this._elements.editor.querySelector("#tankTempHPMiddle");
    this._elements.tankTempHPDown = this._elements.editor.querySelector("#tankTempHPDown");
    this._elements.tankTempWWUp = this._elements.editor.querySelector("#tankTempWWUp");
    this._elements.tankTempWWMiddle = this._elements.editor.querySelector("#tankTempWWMiddle");
    this._elements.tankTempWWDown = this._elements.editor.querySelector("#tankTempWWDown");
    this._elements.supplyTemperatureHeating = this._elements.editor.querySelector("#supplyTemperatureHeating");
    this._elements.refluxTemperatureHeating = this._elements.editor.querySelector("#refluxTemperatureHeating");
    this._elements.evaporatorPressure = this._elements.editor.querySelector("#evaporatorPressure");
    this._elements.evaporatorTemperature = this._elements.editor.querySelector("#evaporatorTemperature");
    this._elements.condenserPressure = this._elements.editor.querySelector("#condenserPressure");
    this._elements.wwHeatingValve = this._elements.editor.querySelector("#wwHeatingValve");
    this._elements.heaterRodWW = this._elements.editor.querySelector("#heaterRodWW");
    this._elements.heaterRodHP = this._elements.editor.querySelector("#heaterRodHP");
    this._elements.heaterRodLevel1 = this._elements.editor.querySelector("#heaterRodLevel1");
    this._elements.heaterRodLevel2 = this._elements.editor.querySelector("#heaterRodLevel2");
    this._elements.linkDetails = this._elements.editor.querySelector("#linkDetails");
    this._elements.linkSettings = this._elements.editor.querySelector("#linkSettings");
  }

  doListen() {
    this._elements.heatingPumpStatusOnOff.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingPumpHotWaterMode.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingPumpHeatingMode.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingPumpCoolingMode.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingPumpPartyMode.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingPumpEnergySaveMode.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingPumpNightMode.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.outdoorTemperature.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.ambientTemperatureNormal.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.ambientTemperatureReduced.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.ambientTemperatureParty.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.supplyTemperature.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.hpRunning.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.compressorRunning.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heatingCircuitPumpRunning.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.circulatingPumpRunning.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.tankTempHPUp.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.tankTempHPMiddle.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.tankTempHPDown.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.tankTempWWUp.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.tankTempWWMiddle.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.tankTempWWDown.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.supplyTemperatureHeating.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.refluxTemperatureHeating.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.evaporatorPressure.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.evaporatorTemperature.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.condenserPressure.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.wwHeatingValve.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heaterRodWW.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heaterRodHP.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heaterRodLevel1.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.heaterRodLevel2.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.linkDetails.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
    this._elements.linkSettings.addEventListener(
      "focusout",
      this.onChanged.bind(this)
    );
  }

  doUpdateConfig() {
    this._elements.heatingPumpStatusOnOff.value = this._config.heatingPumpStatusOnOff;
    this._elements.heatingPumpHotWaterMode.value = this._config.heatingPumpHotWaterMode;
    this._elements.heatingPumpHeatingMode.value = this._config.heatingPumpHeatingMode;
    this._elements.heatingPumpCoolingMode.value = this._config.heatingPumpCoolingMode;
    this._elements.heatingPumpPartyMode.value = this._config.heatingPumpPartyMode;
    this._elements.heatingPumpEnergySaveMode.value = this._config.heatingPumpEnergySaveMode;
    this._elements.heatingPumpNightMode.value = this._config.heatingPumpNightMode;
    this._elements.outdoorTemperature.value = this._config.outdoorTemperature;
    this._elements.ambientTemperatureNormal.value = this._config.ambientTemperatureNormal;
    this._elements.ambientTemperatureReduced.value = this._config.ambientTemperatureReduced;
    this._elements.ambientTemperatureParty.value = this._config.ambientTemperatureParty;
    this._elements.supplyTemperature.value = this._config.supplyTemperature;
    this._elements.hpRunning.value = this._config.hpRunning;
    this._elements.compressorRunning.value = this._config.compressorRunning;
    this._elements.heatingCircuitPumpRunning.value = this._config.heatingCircuitPumpRunning;
    this._elements.circulatingPumpRunning.value = this._config.circulatingPumpRunning;
    this._elements.tankTempHPUp.value = this._config.tankTempHPUp;
    this._elements.tankTempHPMiddle.value = this._config.tankTempHPMiddle;
    this._elements.tankTempHPDown.value = this._config.tankTempHPDown;
    this._elements.tankTempWWUp.value = this._config.tankTempWWUp;
    this._elements.tankTempWWMiddle.value = this._config.tankTempWWMiddle;
    this._elements.tankTempWWDown.value = this._config.tankTempWWDown;
    this._elements.supplyTemperatureHeating.value = this._config.supplyTemperatureHeating;
    this._elements.refluxTemperatureHeating.value = this._config.refluxTemperatureHeating;
    this._elements.evaporatorPressure.value = this._config.evaporatorPressure;
    this._elements.evaporatorTemperature.value = this._config.evaporatorTemperature;
    this._elements.condenserPressure.value = this._config.condenserPressure;
    this._elements.wwHeatingValve.value = this._config.wwHeatingValve;
    this._elements.heaterRodWW.value = this._config.heaterRodWW;
    this._elements.heaterRodHP.value = this._config.heaterRodHP;
    this._elements.heaterRodLevel1.value = this._config.heaterRodLevel1;
    this._elements.heaterRodLevel2.value = this._config.heaterRodLevel2;
    this._elements.linkDetails.value = this._config.linkDetails;
    this._elements.linkSettings.value = this._config.linkSettings;
  }

  doUpdateHass() {
    if (!this._localization) {
      this._localization = HeatPumpCard.readLocalization(this._hass);
      this._elements.editor.querySelector("#heatingPumpStatusOnOffLabel").innerHTML = this._localization.editor['heatingPumpStatusOnOff'];
      this._elements.editor.querySelector("#heatingPumpHotWaterModeLabel").innerHTML = this._localization.editor['heatingPumpHotWaterMode'];
      this._elements.editor.querySelector("#heatingPumpHeatingModeLabel").innerHTML = this._localization.editor['heatingPumpHeatingMode'];
      this._elements.editor.querySelector("#heatingPumpCoolingModeLabel").innerHTML = this._localization.editor['heatingPumpCoolingMode'];
      this._elements.editor.querySelector("#heatingPumpPartyModeLabel").innerHTML = this._localization.editor['heatingPumpPartyMode'];
      this._elements.editor.querySelector("#heatingPumpEnergySaveModeLabel").innerHTML = this._localization.editor['heatingPumpEnergySaveMode'];
      this._elements.editor.querySelector("#heatingPumpNightModeLabel").innerHTML = this._localization.editor['heatingPumpNightMode'];
      this._elements.editor.querySelector("#outdoorTemperatureLabel").innerHTML = this._localization.editor['outdoorTemperature'];
      this._elements.editor.querySelector("#ambientTemperatureNormalLabel").innerHTML = this._localization.editor['ambientTemperatureNormal'];
      this._elements.editor.querySelector("#ambientTemperatureReducedLabel").innerHTML = this._localization.editor['ambientTemperatureReduced'];
      this._elements.editor.querySelector("#ambientTemperaturePartyLabel").innerHTML = this._localization.editor['ambientTemperatureParty'];
      this._elements.editor.querySelector("#supplyTemperatureLabel").innerHTML = this._localization.editor['supplyTemperature'];
      this._elements.editor.querySelector("#hpRunningLabel").innerHTML = this._localization.editor['hpRunning'];
      this._elements.editor.querySelector("#compressorRunningLabel").innerHTML = this._localization.editor['compressorRunning'];
      this._elements.editor.querySelector("#heatingCircuitPumpRunningLabel").innerHTML = this._localization.editor['heatingCircuitPumpRunning'];
      this._elements.editor.querySelector("#circulatingPumpRunningLabel").innerHTML = this._localization.editor['circulatingPumpRunning'];
      this._elements.editor.querySelector("#tankTempHPUpLabel").innerHTML = this._localization.editor['tankTempHPUp'];
      this._elements.editor.querySelector("#tankTempHPMiddleLabel").innerHTML = this._localization.editor['tankTempHPMiddle'];
      this._elements.editor.querySelector("#tankTempHPDownLabel").innerHTML = this._localization.editor['tankTempHPDown'];
      this._elements.editor.querySelector("#tankTempWWUpLabel").innerHTML = this._localization.editor['tankTempWWUp'];
      this._elements.editor.querySelector("#tankTempWWMiddleLabel").innerHTML = this._localization.editor['tankTempWWMiddle'];
      this._elements.editor.querySelector("#tankTempWWDownLabel").innerHTML = this._localization.editor['tankTempWWDown'];
      this._elements.editor.querySelector("#supplyTemperatureHeatingLabel").innerHTML = this._localization.editor['supplyTemperatureHeating'];
      this._elements.editor.querySelector("#refluxTemperatureHeatingLabel").innerHTML = this._localization.editor['refluxTemperatureHeating'];
      this._elements.editor.querySelector("#evaporatorPressureLabel").innerHTML = this._localization.editor['evaporatorPressure'];
      this._elements.editor.querySelector("#evaporatorTemperatureLabel").innerHTML = this._localization.editor['evaporatorTemperature'];
      this._elements.editor.querySelector("#condenserPressureLabel").innerHTML = this._localization.editor['condenserPressure'];
      this._elements.editor.querySelector("#wwHeatingValveLabel").innerHTML = this._localization.editor['wwHeatingValve'];
      this._elements.editor.querySelector("#heaterRodWWLabel").innerHTML = this._localization.editor['heaterRodWW'];
      this._elements.editor.querySelector("#heaterRodHPLabel").innerHTML = this._localization.editor['heaterRodHP'];
      this._elements.editor.querySelector("#heaterRodLevel1Label").innerHTML = this._localization.editor['heaterRodLevel1'];
      this._elements.editor.querySelector("#heaterRodLevel2Label").innerHTML = this._localization.editor['heaterRodLevel2'];
      this._elements.editor.querySelector("#linkDetailsLabel").innerHTML = this._localization.editor['linkDetails'];
      this._elements.editor.querySelector("#linkSettingsLabel").innerHTML = this._localization.editor['linkSettings'];
    }
  }

  doMessageForUpdate(changedEvent) {
    // this._config is readonly, copy needed
    const newConfig = Object.assign({}, this._config);
    if (changedEvent.target.id == "heatingPumpStatusOnOff") {
      newConfig.heatingPumpStatusOnOff = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingPumpHotWaterMode") {
      newConfig.heatingPumpHotWaterMode = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingPumpHeatingMode") {
      newConfig.heatingPumpHeatingMode = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingPumpCoolingMode") {
      newConfig.heatingPumpCoolingMode = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingPumpPartyMode") {
      newConfig.heatingPumpPartyMode = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingPumpEnergySaveMode") {
      newConfig.heatingPumpEnergySaveMode = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingPumpNightMode") {
      newConfig.heatingPumpNightMode = changedEvent.target.value;
    } else if (changedEvent.target.id == "outdoorTemperature") {
      newConfig.outdoorTemperature = changedEvent.target.value;
    } else if (changedEvent.target.id == "ambientTemperatureNormal") {
      newConfig.ambientTemperatureNormal = changedEvent.target.value;
    } else if (changedEvent.target.id == "ambientTemperatureReduced") {
      newConfig.ambientTemperatureReduced = changedEvent.target.value;
    } else if (changedEvent.target.id == "ambientTemperatureParty") {
      newConfig.ambientTemperatureParty = changedEvent.target.value;
    } else if (changedEvent.target.id == "supplyTemperature") {
      newConfig.supplyTemperature = changedEvent.target.value;
    } else if (changedEvent.target.id == "hpRunning") {
      newConfig.hpRunning = changedEvent.target.value;
    } else if (changedEvent.target.id == "compressorRunning") {
      newConfig.compressorRunning = changedEvent.target.value;
    } else if (changedEvent.target.id == "heatingCircuitPumpRunning") {
      newConfig.heatingCircuitPumpRunning = changedEvent.target.value;
    } else if (changedEvent.target.id == "circulatingPumpRunning") {
      newConfig.circulatingPumpRunning = changedEvent.target.value;
    } else if (changedEvent.target.id == "tankTempHPUp") {
      newConfig.tankTempHPUp = changedEvent.target.value;
    } else if (changedEvent.target.id == "tankTempHPMiddle") {
      newConfig.tankTempHPMiddle = changedEvent.target.value;
    } else if (changedEvent.target.id == "tankTempWWDown") {
      newConfig.tankTempWWDown = changedEvent.target.value;
    } else if (changedEvent.target.id == "supplyTemperatureHeating") {
      newConfig.supplyTemperatureHeating = changedEvent.target.value;
    } else if (changedEvent.target.id == "refluxTemperatureHeating") {
      newConfig.refluxTemperatureHeating = changedEvent.target.value;
    } else if (changedEvent.target.id == "evaporatorPressure") {
      newConfig.evaporatorPressure = changedEvent.target.value;
    } else if (changedEvent.target.id == "evaporatorTemperature") {
      newConfig.evaporatorTemperature = changedEvent.target.value;
    } else if (changedEvent.target.id == "condenserPressure") {
      newConfig.condenserPressure = changedEvent.target.value;
    } else if (changedEvent.target.id == "wwHeatingValve") {
      newConfig.wwHeatingValve = changedEvent.target.value;
    } else if (changedEvent.target.id == "heaterRodWW") {
      newConfig.heaterRodWW = changedEvent.target.value;
    } else if (changedEvent.target.id == "heaterRodHP") {
      newConfig.heaterRodHP = changedEvent.target.value;
    } else if (changedEvent.target.id == "heaterRodLevel1") {
      newConfig.heaterRodLevel1 = changedEvent.target.value;
    } else if (changedEvent.target.id == "heaterRodLevel2") {
      newConfig.heaterRodLevel2 = changedEvent.target.value;
    } else if (changedEvent.target.id == "linkDetails") {
      newConfig.linkDetails = changedEvent.target.value;
    } else if (changedEvent.target.id == "linkSettings") {
      newConfig.linkSettings = changedEvent.target.value;
    }
    const messageEvent = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(messageEvent);
  }
}

customElements.define("heat-pump-card-editor", HeatPumpCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "heat-pump-card",
  name: "Heat Pump Card",
  description: "A custom card displaying heat pump state"
});
