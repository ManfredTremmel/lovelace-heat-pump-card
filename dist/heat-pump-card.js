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
    this.content.querySelector("#gHPStatusOff").style.display = this.formatBinary(hass, this.config.heatingPumpStatusOnOff) ? "none" : "inline";
    this.content.querySelector("#gHPStatusWW").style.display = this.formatBinary(hass, this.config.heatingPumpHotWaterMode) ? "inline" : "none";
    this.content.querySelector("#gHPStatusHeating").style.display = this.formatBinary(hass, this.config.heatingPumpHeatingMode) ? "inline" : "none";
    this.content.querySelector("#gHPStatusCooling").style.display = this.formatBinary(hass, this.config.heatingPumpCoolingMode) ? "inline" : "none";

    const heatingPumpPartyMode = this.formatBinary(hass, this.config.heatingPumpPartyMode);
    this.content.querySelector("#gHPStatusParty").style.display = heatingPumpPartyMode ? "inline" : "none";

    this.content.querySelector("#gHPStatusSave").style.display = this.formatBinary(hass, this.config.heatingPumpEnergySaveMode) ? "inline" : "none";

    const heatingPumpNightMode = this.formatBinary(hass, this.config.heatingPumpNightMode);
    this.content.querySelector("#gTimeSymbolNight").style.display = heatingPumpNightMode ? "inline" : "none";
    this.content.querySelector("#gTimeSymbolDay").style.display = heatingPumpNightMode ? "none" : "inline";

    this.content.querySelector("#textOutdoorTemperatureValue").innerHTML = this.formatNum(hass, this.config.outdoorTemperature);

    const ambientTemperatureReduced = this.formatNum(hass, this.config.ambientTemperatureReduced);
    const ambientTemperatureParty = this.formatNum(hass, this.config.ambientTemperatureParty);
    if (heatingPumpPartyMode && ambientTemperatureParty) {
      this.content.querySelector("#textIndoorTemperatureValue").innerHTML = ambientTemperatureParty;
    } else if (heatingPumpNightMode && ambientTemperatureReduced) {
      this.content.querySelector("#textIndoorTemperatureValue").innerHTML = ambientTemperatureReduced;
    } else {
      this.content.querySelector("#textIndoorTemperatureValue").innerHTML = this.formatNum(hass, this.config.ambientTemperatureNormal);
    }

    this.content.querySelector("#textSupplyTemperatureValue").innerHTML = this.formatNum(hass, this.config.supplyTemperature);

    this.switchRotateAttribute("#animationHPFan", hass, this.config.hpRunning);
    this.switchRotateAttribute("#animationCompressor", hass, this.config.compressorRunning);
    if (this.config.heatingCircuitPumpRunning) {
      this.content.querySelector("#gHeatingCircuitPump").style.display = 'inline';
      this.switchRotateAttribute("#animationHeatingCircuitPumpBladeWheel", hass, this.config.heatingCircuitPumpRunning);
    } else {
      this.content.querySelector("#gHeatingCircuitPump").style.display = 'none';
    }
    if (this.config.circulatingPumpRunning) {
      this.content.querySelector("#gCirculatingPump").style.display = 'inline';
      this.switchRotateAttribute("#animationCirculatingPumpBladeWheel", hass, this.config.circulatingPumpRunning);
    } else {
      this.content.querySelector("#gCirculatingPump").style.display = 'none';
    }

    const heaterRodWW = this.formatBinary(hass, this.config.heaterRodWW);

    if (this.config.tankTempHPUp) {
      const tankTempHPUp = this.readState(hass, this.config.tankTempHPUp);
      this.content.querySelector("#gTankHP").style.display = 'inline';
      this.content.querySelector("#textTankTempHPUp").innerHTML = this.formatNumValue(tankTempHPUp);
      const tankTempHPMiddle = this.readState(hass, this.config.tankTempHPMiddle);
      this.content.querySelector("#textTankTempHPMiddle").innerHTML = this.formatNumValue(tankTempHPMiddle);
      const tankTempHPDown = this.readState(hass, this.config.tankTempHPDown);
      this.content.querySelector("#textTankTempHPDown").innerHTML = this.formatNumValue(tankTempHPDown);
      this.tankColors(this.content, tankTempHPUp, tankTempHPMiddle, tankTempHPDown, "#stop3020", "#stop3040", "#stop3030");

        this.content.querySelector("#pathHeaterRodHP").style.display =  this.formatBinary(hass, this.config.heaterRodHP) ? 'block' : 'none';
    } else {
      this.content.querySelector("#gTankHP").style.display = 'none';
    }

    if (this.config.tankTempWWUp) {
      this.content.querySelector("#gWW").style.display = 'inline';
      const tankTempWWUp = this.readState(hass, this.config.tankTempWWUp);
      this.content.querySelector("#textTankTempWWUp").innerHTML = this.formatNumValue(tankTempWWUp);
      const tankTempWWMiddle = this.readState(hass, this.config.tankTempWWMiddle);
      this.content.querySelector("#textTankTempWWMiddle").innerHTML = this.formatNumValue(tankTempWWMiddle);
      const tankTempWWDown = this.readState(hass, this.config.tankTempWWDown);
      this.content.querySelector("#textTankTempWWDown").innerHTML = this.formatNumValue(tankTempWWDown);
      this.tankColors(this.content, tankTempWWUp, tankTempWWMiddle, tankTempWWDown, "#stop3050", "#stop3070", "#stop3060");

      this.content.querySelector("#gWWHeatingValve").setAttribute('transform', 'rotate(' + (this.formatBinary(hass, this.config.wwHeatingValve) ? '90' : '0') + ', 750, 357)');
      this.content.querySelector("#pathHeaterRodWW").style.display = heaterRodWW ? 'block' : 'none';
    } else {
      this.content.querySelector("#gWW").style.display = 'none';
    }

    this.content.querySelector("#textSupplyTemperatureHeating").innerHTML = this.formatNum(hass, this.config.supplyTemperatureHeating);
    this.content.querySelector("#textRefluxTemperatureHeating").innerHTML = this.formatNum(hass, this.config.refluxTemperatureHeating);

    this.content.querySelector("#textEvaporatorPressure").innerHTML = this.formatNum(hass, this.config.evaporatorPressure);
    this.content.querySelector("#textEvaporatorTemperature").innerHTML = this.formatNum(hass, this.config.evaporatorTemperature);
    this.content.querySelector("#textCondenserPressure").innerHTML = this.formatNum(hass, this.config.condenserPressure);
    this.content.querySelector("#textCondenserTemperature").innerHTML = this.formatNum(hass, this.config.condenserTemperature);
    this.content.querySelector("#textExpansionValveOpening").innerHTML = this.formatNum(hass, this.config.expansionValveOpening);

    this.heaterRodColor(this.content, heaterRodWW, this.formatBinary(hass, this.config.heaterRodLevel1), this.formatBinary(hass, this.config.heaterRodLevel2));
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
          this.setValues(hass);
        } else if (lang != "en") {
          this.readLocalization("en", hass);
        } else {
          console.error("No localization for " + lang);
        }
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
          this.innerHTML = '<ha-card header="Heating Pump">\n' + rawFile.responseText.replace(/.*--primary-text-color:.*/g, "") + '</ha-card>';
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

  switchRotateAttribute(attributeName, hass, state) {
    if (this.formatBinary(hass, state)) {
      this.content.querySelector(attributeName).setAttribute('type', 'rotate');
    } else {
      this.content.querySelector(attributeName).removeAttribute('type');
    }
  }

  readState(hass, config) {
    if (config) {
      return hass.states[config];
    }
    return null;
  }

  formatBinary(hass, state) {
    const stateValue = this.readState(hass, state);
    return stateValue && stateValue.state  === "on";
  }

  formatNum(hass, state) {
    const stateValue = this.readState(hass, state);
    return this.formatNumValue(stateValue);
  }

  formatNumValue(stateValue) {
    if (stateValue) {
      return new Intl.NumberFormat(undefined, {minimumFractionDigits: 1}).format(stateValue.state) + " " + stateValue.attributes.unit_of_measurement;
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
    if (!config.heatingPumpHeatingMode) {
      throw new Error("You need to define heatingPumpHeatingMode");
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

    if (!config.supplyTemperatureHeating) {
      throw new Error("You need to define supplyTemperatureHeating");
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
      { name: "heatingPumpHotWaterMode", selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpHeatingMode", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpCoolingMode", selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingPumpPartyMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heatingPumpEnergySaveMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "heatingPumpNightMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "outdoorTemperature", selector: { entity: {domain: ["sensor"]} } },
      { name: "ambientTemperatureNormal", required: true, selector: { entity: {domain: ["sensor", "number"]} } },
      { name: "ambientTemperatureReduced", selector: { entity: {domain: ["sensor", "number"]} } },
      { name: "ambientTemperatureParty", selector: { entity: {domain: ["sensor", "number"]} } },
      { name: "supplyTemperature", selector: { entity: {domain: ["sensor"]} } },
      { name: "hpRunning", required: true, selector: { entity: {domain: ["binary_sensor", "switch"]} } },
      { name: "compressorRunning", required: true, selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "heatingCircuitPumpRunning", selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "circulatingPumpRunning", selector: { entity: {domain: ["binary_sensor"]} } },
      { name: "tankTempHPUp", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempHPMiddle", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempHPDown", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempWWUp", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempWWMiddle", selector: { entity: {domain: ["sensor"]} } },
      { name: "tankTempWWDown", selector: { entity: {domain: ["sensor"]} } },
      { name: "supplyTemperatureHeating", required: true, selector: { entity: {domain: ["sensor"]} } },
      { name: "refluxTemperatureHeating", selector: { entity: {domain: ["sensor"]} } },
      { name: "evaporatorPressure", selector: { entity: {domain: ["sensor"]} } },
      { name: "evaporatorTemperature", selector: { entity: {domain: ["sensor"]} } },
      { name: "condenserPressure", selector: { entity: {domain: ["sensor"]} } },
      { name: "condenserTemperature", selector: { entity: {domain: ["sensor"]} } },
      { name: "expansionValveOpening", selector: { entity: {domain: ["sensor"]} } },
      { name: "wwHeatingValve", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
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
      if (!config.heatingPumpHeatingMode || typeof config.heatingPumpHeatingMode !== "string") {
        throw new Error('Configuration error: "heatingPumpHeatingMode" must be a non-empty string.');
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
      if (!config.supplyTemperatureHeating || typeof config.supplyTemperatureHeating !== "string") {
        throw new Error('Configuration error: "supplyTemperatureHeating" must be a non-empty string.');
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
