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
    this.changeHeatPumpRunning(this.content, this.config.heatingPumpType, this.config.hpRunning, hass);
    this.content.querySelector("#textG2WWaterTempIn").innerHTML = this.formatNum(hass, this.config.temperatureGroundWaterIn);
    this.content.querySelector("#textG2WWaterTempOut").innerHTML = this.formatNum(hass, this.config.temperatureGroundWaterOut);

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

    this.content.querySelector("#gWarning").style.display = this.formatBinary(hass, this.config.warning) ? "inline" : "none";
    this.content.querySelector("#gError").style.display = (this.formatBinary(hass, this.config.error) || this.formatBinary(hass, this.config.warning)) ? "inline" : "none";
    this.content.querySelector("#gDefrost").style.display = this.formatBinary(hass, this.config.defrostMode) ? "inline" : "none";
    this.content.querySelector("#gAdditionalHeating").style.display = this.formatBinary(hass, this.config.additionalHeating) ? "inline" : "none";

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

    this.switchRotateAttribute("#pathCompressor", hass, this.config.compressorRunning);
    if (this.config.heatingCircuitPumpRunning) {
      this.switchRotateAttribute("#gHeatingCircuitPump", hass, this.config.heatingCircuitPumpRunning);
    }
    if (this.config.heatingCircuitPumpRunning2) {
      this.switchRotateAttribute("#gHeatingCircuitPump2", hass, this.config.heatingCircuitPumpRunning2);
    }
    if (this.config.heatingCircuitPumpRunning3) {
      this.switchRotateAttribute("#gHeatingCircuitPump3", hass, this.config.heatingCircuitPumpRunning3);
    }
    if (this.config.circulatingPumpRunning) {
      this.switchRotateAttribute("#gCirculatingPumpBladeWheel", hass, this.config.circulatingPumpRunning);
    }
    if (this.config.storageChargingPumpRunning) {
      this.switchRotateAttribute("#gStorageChargingPump", hass, this.config.storageChargingPumpRunning);
    }

    const heaterRodWW = this.formatBinary(hass, this.config.heaterRodWW);

    if (this.config.tankHP) {
      const tankTempHPUp = this.readState(hass, this.config.tankTempHPUp);
      this.content.querySelector("#textTankTempHPUp").innerHTML = this.formatNumValue(tankTempHPUp);
      const tankTempHPMiddle = this.readState(hass, this.config.tankTempHPMiddle);
      this.content.querySelector("#textTankTempHPMiddle").innerHTML = this.formatNumValue(tankTempHPMiddle);
      const tankTempHPDown = this.readState(hass, this.config.tankTempHPDown);
      this.content.querySelector("#textTankTempHPDown").innerHTML = this.formatNumValue(tankTempHPDown);
      this.tankColors(this.content, tankTempHPUp, tankTempHPMiddle, tankTempHPDown, "#stop3020", "#stop3040", "#stop3030");

      this.content.querySelector("#pathHeaterRodHP").style.display =  this.formatBinary(hass, this.config.heaterRodHP) ? 'block' : 'none';
    }

    if (this.config.tankWW) {
      const tankTempWWUp = this.readState(hass, this.config.tankTempWWUp);
      this.content.querySelector("#textTankTempWWUp").innerHTML = this.formatNumValue(tankTempWWUp);
      const tankTempWWMiddle = this.readState(hass, this.config.tankTempWWMiddle);
      this.content.querySelector("#textTankTempWWMiddle").innerHTML = this.formatNumValue(tankTempWWMiddle);
      const tankTempWWDown = this.readState(hass, this.config.tankTempWWDown);
      this.content.querySelector("#textTankTempWWDown").innerHTML = this.formatNumValue(tankTempWWDown);
      this.tankColors(this.content, tankTempWWUp, tankTempWWMiddle, tankTempWWDown, "#stop3050", "#stop3070", "#stop3060");

      this.content.querySelector("#gWWHeatingValve").setAttribute('transform', 'rotate(' + (this.formatBinary(hass, this.config.wwHeatingValve) ? '90' : '0') + ', 620, 450)');
      this.content.querySelector("#pathHeaterRodWW").style.display = heaterRodWW ? 'block' : 'none';
    }

    this.heatingCurcuit1(this.content, hass);
    this.heatingCurcuit2(this.content, hass);
    this.heatingCurcuit3(this.content, hass);

    this.content.querySelector("#textEvaporatorPressure").innerHTML = this.formatNum(hass, this.config.evaporatorPressure);
    this.content.querySelector("#textEvaporatorTemperature").innerHTML = this.formatNum(hass, this.config.evaporatorTemperature);
    this.content.querySelector("#textCondenserPressure").innerHTML = this.formatNum(hass, this.config.condenserPressure);
    this.content.querySelector("#textCondenserTemperature").innerHTML = this.formatNum(hass, this.config.condenserTemperature);
    this.content.querySelector("#textExpansionValveOpening").innerHTML = this.formatNum(hass, this.config.expansionValveOpening);
    this.content.querySelector("#textCompressorValue").innerHTML = this.readStateValue(hass, this.config.compressorValue);

    this.heaterRodColor(this.content, heaterRodWW, this.formatBinary(hass, this.config.heaterRodLevel1), this.formatBinary(hass, this.config.heaterRodLevel2));

    if (this.config.thermalSolarAvailable) {
      this.switchRotateAttribute("#gThermalSolarPump", hass, this.config.thermalSolarPump);
      this.content.querySelector("#textThermalSolarPanelTemp").innerHTML = this.formatNum(hass, this.config.thermalSolarPanelTemp);
      this.content.querySelector("#textThermalSolarFluxTemp").innerHTML = this.formatNum(hass, this.config.thermalSolarFluxTemp);
      this.content.querySelector("#textThermalSolarPumpSpeed").innerHTML = this.formatNum(hass, this.config.thermalSolarPumpSpeed);
    }

    this.content.querySelector("#textValue000").innerHTML = this.readStateValue(hass, this.config.additionalValue000);
    this.content.querySelector("#textValue001").innerHTML = this.readStateValue(hass, this.config.additionalValue001);
    this.content.querySelector("#textValue002").innerHTML = this.readStateValue(hass, this.config.additionalValue002);
    this.content.querySelector("#textValue003").innerHTML = this.readStateValue(hass, this.config.additionalValue003);
    this.content.querySelector("#textValue004").innerHTML = this.readStateValue(hass, this.config.additionalValue004);
    this.content.querySelector("#textValue005").innerHTML = this.readStateValue(hass, this.config.additionalValue005);
    this.content.querySelector("#textValue006").innerHTML = this.readStateValue(hass, this.config.additionalValue006);
    this.content.querySelector("#textValue007").innerHTML = this.readStateValue(hass, this.config.additionalValue007);
    this.content.querySelector("#textValue008").innerHTML = this.readStateValue(hass, this.config.additionalValue008);
    this.content.querySelector("#textValue009").innerHTML = this.readStateValue(hass, this.config.additionalValue009);
    this.content.querySelector("#textValue010").innerHTML = this.readStateValue(hass, this.config.additionalValue010);
    this.content.querySelector("#textValue011").innerHTML = this.readStateValue(hass, this.config.additionalValue011);
    this.content.querySelector("#textValue012").innerHTML = this.readStateValue(hass, this.config.additionalValue012);
  }

  static cardFolder = "/hacsfiles/lovelace-heat-pump-card/heat-pump-card/";

  readLocalization(lang, hass) {
    const translationLocal = HeatPumpCard.cardFolder + lang + ".json?" + new Date().getTime();
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
          this.content.querySelector("#textSupplyTemperatureLabel").innerHTML = HeatPumpCard.localization.svgTexts['supplyTemperatureLabel'];
          this.setConfig(this.config);
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
    const svgImage = HeatPumpCard.cardFolder + "heat-pump.svg?" + new Date().getTime();
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", svgImage, true);
    rawFile.onload = (e) => {
      if (rawFile.readyState === 4) {
        if (rawFile.status == 200) {
          this.innerHTML = '<ha-card>\n' + rawFile.responseText.replace(/.*--primary-text-color:.*/g, "").replace(/ class="rotate"/g, "").replace(/display: inline;/g, "display: none;") + '</ha-card>';
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
      if (this.config.linkDetails) {
        this.content.querySelector("#linkDetails").setAttribute('href', this.config.linkDetails);
      }
      if (this.config.linkSettings) {
        this.content.querySelector("#linkSettings").setAttribute('href', this.config.linkSettings);
      }
    }
  }

  switchRotateAttribute(attributeName, hass, state) {
    if (this.formatBinary(hass, state)) {
      this.content.querySelector(attributeName).classList.add("rotate");
    } else {
      this.content.querySelector(attributeName).classList.remove("rotate");
    }
  }

  readState(hass, config) {
    if (config) {
      return hass.states[config];
    }
    return null;
  }

  readStateValue(hass, config) {
    const stateValue = this.readState(hass, config);
    const valueNumeric = this.formatNumValue(stateValue);
    return valueNumeric ? valueNumeric : (stateValue ? stateValue.state : '');
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
    if (stateValue && !isNaN(Number(stateValue.state))) {
      const unit = stateValue.attributes.unit_of_measurement ? stateValue.attributes.unit_of_measurement :  "";
      return new Intl.NumberFormat(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(stateValue.state) + " " + unit;
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
    if (!temp) {
      return "#ffffff00";
    }
    if (temp > 60) {
      return "#ff0000"
    }
    return "#" + ("0" + Math.round(255 * temp / 60).toString(16)).substr(-2) + "00" + ("0" + Math.round(255 * Math.abs(60 - temp) / 60).toString(16)).substr(-2);
  }

  tankColors(content, tankTempUp, tankTempMiddle, tankTempDown, idUp, idMiddle, idDown) {
    var tempUp = tankTempUp && !isNaN(Number(tankTempUp.state)) ? tankTempUp.state : null;
    var tempMiddle = tankTempMiddle && !isNaN(Number(tankTempMiddle.state)) ? tankTempMiddle.state : null;
    var tempDown = tankTempDown && !isNaN(Number(tankTempDown.state)) ? tankTempDown.state : null;
    if (tempUp) {
      if (!tempMiddle) {
        if (tempDown) {
          tempMiddle = (tempUp + tempDown) / 2;
        } else {
          tempMiddle = tempUp - 5;
        }
      }
    } else {
      if (tempMiddle) {
        tempUp = tempMiddle + 5;
      } else if (tempDown) {
        tempMiddle = tempDown + 5;
        tempUp = tempDown + 10;
      }
    }
    if (tempMiddle && !tempDown) {
      tempDown = tempMiddle - 5;
    }
    content.querySelector(idUp).setAttribute('style', "stop-color:" + this.tempColor(tempUp));
    content.querySelector(idMiddle).setAttribute('style', "stop-color:" + this.tempColor(tempMiddle));
    content.querySelector(idDown).setAttribute('style', "stop-color:" + this.tempColor(tempDown));
  }

  linkHandling(event) {
    event.preventDefault();
    window.history.pushState(null,"",this.getAttribute('href'));
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  changeHeatPumpRunning(content, selection, running, hass) {
    this.switchRotateAttribute("#pathHPFan", hass, !selection || selection === 'A2W' ? running : null);
    this.switchRotateAttribute("#gHPW2WPumpBladeWheel", hass, selection === 'W2W' ? running : null);
    this.switchRotateAttribute("#gHPG2WPumpBladeWheel", hass, selection === 'G2W' ? running : null);
  }

  heatingCurcuit1(content, hass) {
    var type = this.config.heatingCircuitType1;
    if (type && type != 'off') {
      var tempInState = this.readState(hass, this.config.supplyTemperatureHeating);
      var tempIn = tempInState ? tempInState.state : 30;
      var tempOutState = this.readState(hass, this.config.refluxTemperatureHeating);
      var tempOut = Math.max(0, tempOutState ? tempOutState.state : tempIn - 10);
      content.querySelector('#stopCircuit1').setAttribute('style', "stop-color:" + this.tempColor(tempIn));
      content.querySelector('#stopCircuit2').setAttribute('style', "stop-color:" + this.tempColor(tempOut));
      content.querySelector("#textSupplyTemperatureHeating").innerHTML = this.formatNumValue(tempInState);
      content.querySelector("#textRefluxTemperatureHeating").innerHTML = this.formatNumValue(tempOutState);
    }
  }

  heatingCurcuit2(content, hass) {
    var type = this.config.heatingCircuitType2;
    if (type && type != 'off') {
      var tempInState = this.readState(hass, this.config.supplyTemperatureHeating2);
      var tempIn = tempInState ? tempInState.state : 30;
      var tempOutState = this.readState(hass, this.config.refluxTemperatureHeating2);
      var tempOut = Math.max(0, tempOutState ? tempOutState.state : tempIn - 10);
      content.querySelector('#stopCircuit3').setAttribute('style', "stop-color:" + this.tempColor(tempIn));
      content.querySelector('#stopCircuit4').setAttribute('style', "stop-color:" + this.tempColor(tempOut));
      content.querySelector("#textSupplyTemperatureHeating2").innerHTML = this.formatNumValue(tempInState);
      content.querySelector("#textRefluxTemperatureHeating2").innerHTML = this.formatNumValue(tempOutState);
    }
  }

  heatingCurcuit3(content, hass) {
    var type = this.config.heatingCircuitType3;
    if (type && type != 'off') {
      var tempInState = this.readState(hass, this.config.supplyTemperatureHeating3);
      var tempIn = tempInState ? tempInState.state : 30;
      var tempOutState = this.readState(hass, this.config.refluxTemperatureHeating3);
      var tempOut = Math.max(0, tempOutState ? tempOutState.state : tempIn - 10);
      content.querySelector('#stopCircuit5').setAttribute('style', "stop-color:" + this.tempColor(tempIn));
      content.querySelector('#stopCircuit6').setAttribute('style', "stop-color:" + this.tempColor(tempOut));
      content.querySelector("#textSupplyTemperatureHeating3").innerHTML = this.formatNumValue(tempInState);
      content.querySelector("#textRefluxTemperatureHeating3").innerHTML = this.formatNumValue(tempOutState);
    }
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    this.config = config;
    if (this.content) {
      this.querySelector("ha-card").setAttribute("header", config.title);
      this.content.querySelector('#gHPFan').style.display = (!config.heatingPumpType || config.heatingPumpType === 'A2W' ? 'inline' : 'none');
      this.content.querySelector('#gHPW2W').style.display = (config.heatingPumpType === 'W2W' ? 'inline' : 'none');
      this.content.querySelector('#gHPG2W').style.display = (config.heatingPumpType === 'G2W' ? 'inline' : 'none');
      this.content.querySelector("#gCirculatingPump").style.display = config.circulatingPumpRunning ? 'inline' : 'none';
      this.content.querySelector('#gCirculatingPumpBladeWheel').classList.remove("rotate");
      this.content.querySelector("#gStorageChargingPump").style.display = config.storageChargingPumpRunning ? 'inline' : 'none';
      this.content.querySelector('#gStorageChargingPump').classList.remove("rotate");
      this.content.querySelector("#gTankHP").style.display = config.tankHP ? 'inline' : 'none';
      this.content.querySelector("#gWW").style.display = config.tankWW ? 'inline' : 'none';

      var type1 = config.heatingCircuitType1;
      if (!type1 || type1 === 'off') {
        this.content.querySelector('#gHeaterCircuit1').style.display = 'none';
      } else {
        this.content.querySelector('#gHeaterCircuit1').style.display = 'inline';
        this.content.querySelector('#gHeaterCircuitFloor1').style.display = (type1 === 'underfloor' ? 'inline' : 'none');
        this.content.querySelector('#radiator1').style.display = (type1 === 'radiator' ? 'inline' : 'none');
      }
      this.content.querySelector('#gHeatingCircuitPump').classList.remove("rotate");
      this.content.querySelector("#gHeatingCircuitPump").style.display = config.heatingCircuitPumpRunning ? 'inline' : 'none';

      var type2 = config.heatingCircuitType2;
      if (!type2 || type2 === 'off') {
        this.content.querySelector('#gHeaterCircuit2').style.display = 'none';
      } else {
        this.content.querySelector('#gHeaterCircuit2').style.display = 'inline';
        this.content.querySelector('#gHeaterCircuitFloor2').style.display = (type2 === 'underfloor' ? 'inline' : 'none');
        this.content.querySelector('#radiator2').style.display = (type2 === 'radiator' ? 'inline' : 'none');
      }
      this.content.querySelector('#gHeatingCircuitPump2').classList.remove("rotate");
      this.content.querySelector("#gHeatingCircuitPump2").style.display = config.heatingCircuitPumpRunning2 ? 'inline' : 'none';
      this.content.querySelector("#pathPipeToHP2").style.display = (!type1 || type1 === 'off') && (!type2 || type2 === 'off') ? 'none' : 'inline';

      var type3 = config.heatingCircuitType3;
      if (!type3 || type3 === 'off') {
        this.content.querySelector('#gHeaterCircuit3').style.display = 'none';
      } else {
        this.content.querySelector('#gHeaterCircuit3').style.display = 'inline';
        this.content.querySelector('#gHeaterCircuitFloor3').style.display = (type3 === 'underfloor' ? 'inline' : 'none');
        this.content.querySelector('#radiator3').style.display = (type3 === 'radiator' ? 'inline' : 'none');
      }
      this.content.querySelector('#gHeatingCircuitPump3').classList.remove("rotate");
      this.content.querySelector("#gHeatingCircuitPump3").style.display = config.heatingCircuitPumpRunning3 ? 'inline' : 'none';

      var noHeating = (!type1 || type1 === 'off') && (!type2 || type2 === 'off') && (!type3 || type3 === 'off') && !config.tankHP;
      var noHotWater = !config.tankWW;

      if (noHeating && noHotWater) {
        this.content.querySelector("#gPipe").style.display = 'none';
        this.content.querySelector("#gPipeBuffer").style.display = 'none';
        this.content.querySelector("#gPipeLayeredChargeStorage").style.display = 'none';
        this.content.querySelector("#gHP").setAttribute("transform", "translate(460 -300)");
        this.content.querySelector("#gSettings").setAttribute("transform", "translate(-25)");
      } else {
        this.content.querySelector("#pathPipeToBuffer").style.display = noHeating ? 'none' : 'inline';
        this.content.querySelector("#pathPipeFromBuffer").style.display = noHeating ? 'none' : 'inline';
        this.content.querySelector("#gPipe").style.display = 'inline';
        this.content.querySelector("#gPipeBuffer").style.display = config.layeredChargeStorage ? 'none' : 'inline';
        this.content.querySelector("#gPipeLayeredChargeStorage").style.display = config.layeredChargeStorage ? 'inline' : 'none';
        this.content.querySelector("#gWWHeatingValve").style.display = config.layeredChargeStorage ? 'none' : 'inline';
        this.content.querySelector("#gHP").removeAttribute("transform");
        this.content.querySelector("#gSettings").removeAttribute("transform");
      }

      if (!config.thermalSolarAvailable || config.thermalSolarAvailable === 'off') {
        this.content.querySelector('#gThermalSolar').style.display = 'none';
      } else {
        this.content.querySelector('#gThermalSolar').style.display = 'inline';
      }
      this.content.querySelector('#gThermalSolarPump').classList.remove("rotate");

      this.content.querySelector("#textLabel000").innerHTML = config.additionalLabel000 ? config.additionalLabel000 : '';
      this.content.querySelector("#textLabel001").innerHTML = config.additionalLabel001 ? config.additionalLabel001 : '';
      this.content.querySelector("#textLabel002").innerHTML = config.additionalLabel002 ? config.additionalLabel002 : '';
      this.content.querySelector("#textLabel003").innerHTML = config.additionalLabel003 ? config.additionalLabel003 : '';
      this.content.querySelector("#textLabel004").innerHTML = config.additionalLabel004 ? config.additionalLabel004 : '';
      this.content.querySelector("#textLabel005").innerHTML = config.additionalLabel005 ? config.additionalLabel005 : '';
      this.content.querySelector("#textLabel006").innerHTML = config.additionalLabel006 ? config.additionalLabel006 : '';
      this.content.querySelector("#textLabel007").innerHTML = config.additionalLabel007 ? config.additionalLabel007 : '';
      this.content.querySelector("#textLabel008").innerHTML = config.additionalLabel008 ? config.additionalLabel008 : '';
      this.content.querySelector("#textLabel009").innerHTML = config.additionalLabel009 ? config.additionalLabel009 : '';
      this.content.querySelector("#textLabel010").innerHTML = config.additionalLabel010 ? config.additionalLabel010 : '';
      this.content.querySelector("#textLabel011").innerHTML = config.additionalLabel011 ? config.additionalLabel011 : '';
      this.content.querySelector("#textLabel012").innerHTML = config.additionalLabel012 ? config.additionalLabel012 : '';

      this.setLinks();
    }
  }

  static getConfigForm() {
    // Define the form schema.
    const SCHEMA = [
      { name: "title", selector: { text: {} } },
      {
        name: "heatingPumpType",
        default: "A2W",
        selector: {
          select: {
            options: [
              { value: "A2W", label: "Air to Water" },
              { value: "W2W", label: "Water to Water"},
              { value: "G2W", label: "Ground to Water"},
            ],
          },
        },
      },
      { type: "expandable",
        name: "groundWaterInOut",
        flatten: true,
        schema: [
          { name: "temperatureGroundWaterIn", selector: { entity: {domain: ["sensor"]} } },
          { name: "temperatureGroundWaterOut", selector: { entity: {domain: ["sensor"]} } },
        ],
      },
      { type: "expandable",
        name: "states",
        flatten: true,
        schema: [
          { name: "heatingPumpStatusOnOff", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "heatingPumpHotWaterMode", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "heatingPumpHeatingMode", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "heatingPumpCoolingMode", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "heatingPumpPartyMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "heatingPumpEnergySaveMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "heatingPumpNightMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "warning", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "error", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "defrostMode", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "additionalHeating", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "hpRunning", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "compressorRunning", selector: { entity: {domain: ["binary_sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "temperatures",
        flatten: true,
        schema: [
          { name: "outdoorTemperature", selector: { entity: {domain: ["sensor"]} } },
          { name: "ambientTemperatureNormal", selector: { entity: {domain: ["sensor", "number"]} } },
          { name: "ambientTemperatureReduced", selector: { entity: {domain: ["sensor", "number"]} } },
          { name: "ambientTemperatureParty", selector: { entity: {domain: ["sensor", "number"]} } },
          { name: "supplyTemperature", selector: { entity: {domain: ["sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "bufferTank",
        flatten: true,
        schema: [
          { name: "tankHP", default: true, selector: { boolean: {} } },
          { name: "tankTempHPUp", selector: { entity: {domain: ["sensor"]} } },
          { name: "tankTempHPMiddle", selector: { entity: {domain: ["sensor"]} } },
          { name: "tankTempHPDown", selector: { entity: {domain: ["sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "hotWaterTank",
        flatten: true,
        schema: [
          { name: "tankWW", default: true, selector: { boolean: {} } },
          { name: "layeredChargeStorage", default: false, selector: { boolean: {} } },
          { name: "tankTempWWUp", selector: { entity: {domain: ["sensor"]} } },
          { name: "tankTempWWMiddle", selector: { entity: {domain: ["sensor"]} } },
          { name: "tankTempWWDown", selector: { entity: {domain: ["sensor"]} } },
          { name: "wwHeatingValve", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "circulatingPumpRunning", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "storageChargingPumpRunning", selector: { entity: {domain: ["binary_sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "heatingCircuit1",
        flatten: true,
        schema: [
          {
            name: "heatingCircuitType1",
            default: "off",
            selector: {
              select: {
                options: [
                  { value: "off", label: "Off" },
                  { value: "underfloor", label: "Underfloor"},
                  { value: "radiator", label: "Radiator"},
                ],
              },
            },
          },
          { name: "heatingCircuitPumpRunning", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "supplyTemperatureHeating", selector: { entity: {domain: ["sensor"]} } },
          { name: "refluxTemperatureHeating", selector: { entity: {domain: ["sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "heatingCircuit2",
        flatten: true,
        schema: [
          {
            name: "heatingCircuitType2",
            default: "off",
            selector: {
              select: {
                options: [
                  { value: "off", label: "Off" },
                  { value: "underfloor", label: "Underfloor"},
                  { value: "radiator", label: "Radiator"},
                ],
              },
            },
          },
          { name: "heatingCircuitPumpRunning2", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "supplyTemperatureHeating2", selector: { entity: {domain: ["sensor"]} } },
          { name: "refluxTemperatureHeating2", selector: { entity: {domain: ["sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "heatingCircuit3",
        flatten: true,
        schema: [
          {
            name: "heatingCircuitType3",
            default: "off",
            selector: {
              select: {
                options: [
                  { value: "off", label: "Off" },
                  { value: "underfloor", label: "Underfloor"},
                  { value: "radiator", label: "Radiator"},
                ],
              },
            },
          },
          { name: "heatingCircuitPumpRunning3", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "supplyTemperatureHeating3", selector: { entity: {domain: ["sensor"]} } },
          { name: "refluxTemperatureHeating3", selector: { entity: {domain: ["sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "heatPumpSensors",
        flatten: true,
        schema: [
          { name: "evaporatorPressure", selector: { entity: {domain: ["sensor"]} } },
          { name: "evaporatorTemperature", selector: { entity: {domain: ["sensor"]} } },
          { name: "condenserPressure", selector: { entity: {domain: ["sensor"]} } },
          { name: "condenserTemperature", selector: { entity: {domain: ["sensor"]} } },
          { name: "expansionValveOpening", selector: { entity: {domain: ["sensor"]} } },
          { name: "compressorValue", selector: { entity: {domain: ["sensor"]} } }
        ],
      },
      { type: "expandable",
        name: "heaterRod",
        flatten: true,
        schema: [
          { name: "heaterRodWW", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "heaterRodHP", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "heaterRodLevel1", selector: { entity: {domain: ["binary_sensor", "switch"]} } },
          { name: "heaterRodLevel2", selector: { entity: {domain: ["binary_sensor", "switch"]} } }
        ],
      },
      { type: "expandable",
        name: "thermalSolar",
        flatten: true,
        schema: [
          { name: "thermalSolarAvailable", default: false, selector: { boolean: {} } },
          { name: "thermalSolarPanelTemp", selector: { entity: {domain: ["sensor", "number"]} } },
          { name: "thermalSolarFluxTemp", selector: { entity: {domain: ["sensor", "number"]} } },
          { name: "thermalSolarPump", selector: { entity: {domain: ["binary_sensor"]} } },
          { name: "thermalSolarPumpSpeed", selector: { entity: {domain: ["sensor", "number"]} } }
        ],
      },
      { type: "expandable",
        name: "links",
        flatten: true,
        schema: [
          { name: "linkDetails", selector: { navigation: {} } },
          { name: "linkSettings", selector: { navigation: {} } }
        ],
      },
      { type: "expandable",
        name: "additionalValues",
        flatten: true,
        schema: [
          { name: "additionalLabel000", selector: { text: {} } },
          { name: "additionalValue000", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel001", selector: { text: {} } },
          { name: "additionalValue001", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel002", selector: { text: {} } },
          { name: "additionalValue002", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel003", selector: { text: {} } },
          { name: "additionalValue003", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel004", selector: { text: {} } },
          { name: "additionalValue004", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel005", selector: { text: {} } },
          { name: "additionalValue005", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel006", selector: { text: {} } },
          { name: "additionalValue006", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel007", selector: { text: {} } },
          { name: "additionalValue007", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel008", selector: { text: {} } },
          { name: "additionalValue008", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel009", selector: { text: {} } },
          { name: "additionalValue009", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel010", selector: { text: {} } },
          { name: "additionalValue010", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel011", selector: { text: {} } },
          { name: "additionalValue011", selector: { entity: {domain: ["sensor"]} } },
          { name: "additionalLabel012", selector: { text: {} } },
          { name: "additionalValue012", selector: { entity: {domain: ["sensor"]} } }
        ],
      }
    ];

    // A simple assertion function to validate the configuration.
    const assertConfig = (config) => {
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
