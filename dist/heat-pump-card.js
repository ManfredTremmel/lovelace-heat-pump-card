class HeatPumpCard extends HTMLElement {

  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {

    if (this.content) {
      this.setValues(hass);
    } else {
      // Load resources and Initialize the content if it's not there yet.
      this.readSvg(hass.language.substring(0,2), this.handleSvg, hass);
    }
  }

  setValues(hass) {
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
      'to', (this.formatBinary(hass.states[this.config.hpRunning]) ? '360' : '0') + ' 190 485');

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

  static cardFolder = "/hacsfiles/lovelace-heat-pump-card/heat-pump-card/";

  readLocalization(lang, hass) {
    const translationLocal = HeatPumpCard.cardFolder + lang + ".json";
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", translationLocal, true);
    rawFile.onload = (e) => {
      if (rawFile.readyState === 4) {
        if (rawFile.status == 200) {
          HeatPumpCard.localization = JSON.parse(rawFile.responseText);
          this.content.querySelector("#textTankWWName").innerHTML = HeatPumpCard.localization.svgTexts['tankWWName'];
          this.content.querySelector("#textTankHPName").innerHTML = HeatPumpCard.localization.svgTexts['tankHPName'];
          this.content.querySelector("#textEvaporator").innerHTML = HeatPumpCard.localization.svgTexts['evaporator'];
          this.content.querySelector("#textCondenser").innerHTML = HeatPumpCard.localization.svgTexts['condenser'];
          this.content.querySelector("#textCompressor").innerHTML = HeatPumpCard.localization.svgTexts['compressor'];
          this.content.querySelector("#textExpansionValve").innerHTML = HeatPumpCard.localization.svgTexts['expansionValve'];
          this.content.querySelector("#textCirculatingPump").innerHTML = HeatPumpCard.localization.svgTexts['circulatingPump'];
          this.content.querySelector("#textHeatingCircuitPump").innerHTML = HeatPumpCard.localization.svgTexts['heatingCircuitPump'];
          this.content.querySelector("#textSupplyTemperatureLabel").innerHTML = HeatPumpCard.localization.svgTexts['supplyTemperatureLabel'];
          this.querySelector("ha-card").setAttribute("header", HeatPumpCard.localization.header);
          this.setLinks();
        } else {
          console.error("No localization for " + lang);
        }
        this.setValues(hass);
      }
    };
    rawFile.onerror = (e) => {
      console.error(rawFile.statusText);
    };
    rawFile.send(null);
  }

  readSvg(lang, handleSvg, hass) {
    const svgImage = HeatPumpCard.cardFolder + "heat-pump.svg";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", svgImage, true);
    rawFile.onload = (e) => {
      if (rawFile.readyState === 4) {
        if (rawFile.status == 200) {
          this.innerHTML = '<ha-card header="Heating Pump">\n' + rawFile.responseText + '</ha-card>';
          this.content = this.querySelector("svg");
          this.content.querySelector("#linkDetails").addEventListener("click", this.linkHandling);
          this.content.querySelector("#linkSettings").addEventListener("click", this.linkHandling);
          this.readLocalization(lang, hass);
        } else {
          alert("Can't read svg image " + rawFile.statusText);
        }
      }
    };
    rawFile.onerror = (e) => {
      console.error(rawFile.statusText);
    };
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

  static getConfigForm() {
    // Define the form schema.
    const SCHEMA = [
      { name: "heatingPumpStatusOnOff", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpHotWaterMode", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpHeatingMode", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpCoolingMode", selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpPartyMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heatingPumpEnergySaveMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heatingPumpNightMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "outdoorTemperature", required: true, selector: { entity: {domain: ["sensor"]} } },
      { name: "ambientTemperatureNormal", required: true, selector: { entity: {domain: ["sensor", "number"]} } },
      { name: "ambientTemperatureReduced", selector: { entity: {domain: ["sensor", "number"]} } },
      { name: "ambientTemperatureParty", selector: { entity: {domain: ["sensor", "number"]} } },
      { name: "supplyTemperature", selector: { entity: {domain: ["sensor"]} } },
      { name: "hpRunning", required: true, selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "compressorRunning", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingCircuitPumpRunning", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "circulatingPumpRunning", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "tankTempHPUp", required: true, selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempHPMiddle", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempHPDown", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempWWUp", required: true, selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempWWMiddle", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempWWDown", selector: { entity: {domain: ["sensor"]} } },
      { name: "supplyTemperatureHeating", required: true, selector: { entity: {domain: ["sensor"]} } },
      { name: "refluxTemperatureHeating", selector: { entity: {domain: ["sensor"]} } },
      { name: "evaporatorPressure", selector: { entity: {domain: ["sensor"]} } },
      { name: "evaporatorTemperature", selector: { entity: {domain: ["sensor"]} } },
      { name: "condenserPressure", selector: { entity: {domain: ["sensor"]} } },
      { name: "wwHeatingValve", required: true, selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heaterRodWW", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heaterRodHP", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heaterRodLevel1", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heaterRodLevel2", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "linkDetails", required: true, selector: { navigation: {} } },
      { name: "linkSettings", required: true, selector: { navigation: {} } },
    ];

    // A simple assertion function to validate the configuration.
    const assertConfig = (config) => {
      if (!config.heatingPumpStatusOnOff || typeof config.heatingPumpStatusOnOff !== "string") {
        throw new Error('Configuration error: "heatingPumpStatusOnOff" must be a non-empty string.');
      }
      if (!config.heatingPumpHotWaterMode || typeof config.heatingPumpHotWaterMode !== "string") {
        throw new Error('Configuration error: "heatingPumpHotWaterMode" must be a non-empty string.');
      }
      if (!config.heatingPumpHeatingMode || typeof config.heatingPumpHeatingMode !== "string") {
        throw new Error('Configuration error: "heatingPumpHeatingMode" must be a non-empty string.');
      }
      if (!config.outdoorTemperature || typeof config.outdoorTemperature !== "string") {
        throw new Error('Configuration error: "outdoorTemperature" must be a non-empty string.');
      }
      if (!config.ambientTemperatureNormal || typeof config.ambientTemperatureNormal !== "string") {
        throw new Error('Configuration error: "ambientTemperatureNormal" must be a non-empty string.');
      }
      if (!config.hpRunning || typeof config.hpRunning !== "string") {
        throw new Error('Configuration error: "hpRunning" must be a non-empty string.');
      }
      if (!config.compressorRunning || typeof config.compressorRunning !== "string") {
        throw new Error('Configuration error: "compressorRunning" must be a non-empty string.');
      }
      if (!config.heatingCircuitPumpRunning || typeof config.heatingCircuitPumpRunning !== "string") {
        throw new Error('Configuration error: "heatingCircuitPumpRunning" must be a non-empty string.');
      }
      if (!config.circulatingPumpRunning || typeof config.circulatingPumpRunning !== "string") {
        throw new Error('Configuration error: "circulatingPumpRunning" must be a non-empty string.');
      }
      if (!config.tankTempHPUp || typeof config.tankTempHPUp !== "string") {
        throw new Error('Configuration error: "tankTempHPUp" must be a non-empty string.');
      }
      if (!config.tankTempWWUp || typeof config.tankTempWWUp !== "string") {
        throw new Error('Configuration error: "tankTempWWUp" must be a non-empty string.');
      }
      if (!config.supplyTemperatureHeating || typeof config.supplyTemperatureHeating !== "string") {
        throw new Error('Configuration error: "supplyTemperatureHeating" must be a non-empty string.');
      }
      if (!config.wwHeatingValve || typeof config.wwHeatingValve !== "string") {
        throw new Error('Configuration error: "wwHeatingValve" must be a non-empty string.');
      }
      if (!config.linkDetails || typeof config.linkDetails !== "string") {
        throw new Error('Configuration error: "linkDetails" must be a non-empty string.');
      }
      if (!config.linkSettings || typeof config.linkSettings !== "string") {
        throw new Error('Configuration error: "linkSettings" must be a non-empty string.');
      }
    };

    // computeLabel returns a localized label for a schema item.
    const computeLabel = (schema, localize) => {
      return HeatPumpCard.localization.editor[schema.name];
    };

    return {
      schema: SCHEMA,
      assertConfig: assertConfig,
      computeLabel: computeLabel,
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

window.customCards = window.customCards || [];
window.customCards.push({
  type: "heat-pump-card",
  name: "Heat Pump Card",
  description: "A custom card displaying heat pump state"
});
