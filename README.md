[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

# Heat Pump card

Home Assistant dashboard card displaying heat pump parameters

![Example picture of the heat pump card.](https://raw.githubusercontent.com/ManfredTremmel/lovelace-heat-pump-card/refs/heads/main/dist/heat-pump-card/heat-pump.svg)

#### Installation
The easiest way to install it is through [HACS (Home Assistant Community Store)](https://github.com/hacs/frontend),
search for <i>heat-pump-card</i> and install the Plugins.

If you are not using HACS, you may download all from dist folder (heat-pump-card.js and heat-pump-card directory with the translations and heat-pump.svg) and put them into
homeassistant_config_dir/www/community/heat-pump-card/ directory.

The card does not support configuration flow, therefore you'll have to add the resources via UI->Configuration
->Lovelace Dashboards->Resources then add the card manually editing the card configuration yaml on the dashboard at
Add Card->Manual.

**Options**

| Name | Type | Requirement | Description
| ---- | ---- | ----------- | -----------
| heatingPumpStatusOnOff | object | **Required** | if heating pump is off, power symbol is displayed
| heatingPumpHotWaterMode | object | **Required** | Hot Water Mode, when on, faucet symbol is displayed
| heatingPumpHeatingMode | object | **Required** | if Heating Mode is on, radiator symbol is displayed
| heatingPumpCoolingMode | object | optional | in Cooling Mode, the cooling symbol is displayed
| heatingPumpPartyMode | object | optional | in Party Mode the drinking glass symbol and `ambientTemperatureParty` (when set) is displayed
| heatingPumpEnergySaveMode | object | optional | in Energy Saving Mode the piggybank symbol and `ambientTemperatureReduced` (when set) is displayed
| heatingPumpNightMode | object | optional | Night Mode switches between sun and moon symbol
| outdoorTemperature | object | **Required** | Outdoor Temperature
| ambientTemperatureNormal | object | **Required** | Ambient Temperature normal
| ambientTemperatureReduced | object | optional | Ambient Temperature reduced (used when `heatingPumpEnergySaveMode` is on)
| ambientTemperatureParty | object | optional | Ambient Temperature Party (used when `heatingPumpPartyMode` is on)
| supplyTemperature | object | optional | Supply Temperature
| hpRunning | object | **Required** | when Primary Source is active, the fan animation is running
| compressorRunning | object | **Required** | Binary sensor which detects if Compressor is running
| heatingCircuitPumpRunning | object | **Required** | Binary sensor which detects if Heating Circuit Pump is running
| circulatingPumpRunning | object | **Required** | Binary sensor which detects if Circulating Pump is running
| tankTempHPUp | object | **Required** | Buffer Temperature up, displayed in buffer tank and fill upper color is set between blue (≦ 20 ℃) and red (≧ 60 ℃)
| tankTempHPMiddle | object | optional | Buffer Temperature middle, displayed in buffer tank and middle fill color is set between blue (≦ 20 ℃) and red (≧ 60 ℃), if not set, for calculating fill color above temperature - 5 ℃ is used
| tankTempHPDown | object | optional | Buffer Temperature down, displayed in buffer tank and lower fill color is set between blue (≦ 20 ℃) and red (≧ 60 ℃), if not set, for calculating fill color above temperature - 5 ℃ is used
| tankTempWWUp | object | **Required** | Hot Water Buffer Temperature up, displayed in buffer tank and fill upper color is set between blue (≦ 20 ℃) and red (≧ 60 ℃)
| tankTempWWMiddle | object | optional | Hot Water Buffer Temperature middle, displayed in buffer tank and middle fill color is set between blue (≦ 20 ℃) and red (≧ 60 ℃), if not set, for calculating fill color above temperature - 5 ℃ is used
| tankTempWWDown | object | optional | Hot Water Buffer Temperature down, displayed in buffer tank and lower fill color is set between blue (≦ 20 ℃) and red (≧ 60 ℃), if not set, for calculating fill color above temperature - 5 ℃ is used
| supplyTemperatureHeating | object | **Required**  | Supply Temperature Heating
| refluxTemperatureHeating | object | optional |  | Reflux Temperature Heating
| evaporatorPressure | object | optional | Evaporator Pressure
| evaporatorTemperature | object | optional  | Evaporator Temperature
| condenserPressure | object | optional | Condenser Pressure
| wwHeatingValve | object | **Required**  | Heating/Hot Water Valve
| heaterRodWW | object | optional | Heater Rod Hot Water is active and displayed in the buffer tank
| heaterRodHP | object | optional | Heater Rod Heating is active and displayed in the buffer tank
| heaterRodLevel1 | object | optional | Heater Rod is using Level 1, color is set to orange
| heaterRodLevel2 | object | optional | Heater Rod is using Level 2, color is set to red
| linkDetails | string | **Required** | Link to details page
| linkSettings | string | **Required** | Link to settings page


**Example**

This are my settings for Viessmann Vitocal 350 with Vitotronic 200 heating pump, most stuff is provided by Vcontrol add-on (everything with `mosquitto_mqtt_broker` in the name),
additional binary_sensors I've created as helper to translate the heat pump modes to universal values. Otherwise a translation for each different heat pump needed to be integrated.

```yaml
- type: custom:heat-pump-card
  heatingPumpStatusOnOff: binary_sensor.heating_pump_status_on_off
  heatingPumpHotWaterMode: binary_sensor.heating_pump_hot_water_mode
  heatingPumpHeatingMode: binary_sensor.heating_pump_heating_mode
  heatingPumpCoolingMode: binary_sensor.heating_pump_cooling_mode
  heatingPumpPartyMode: binary_sensor.heating_pump_party_mode
  heatingPumpEnergySaveMode: binary_sensor.heating_pump_energy_save_mode
  heatingPumpNightMode: binary_sensor.heating_pump_night_mode
  outdoorTemperature: sensor.mosquitto_mqtt_broker_aussentemperatur
  ambientTemperatureNormal: number.mosquitto_mqtt_broker_raumsolltemperatur_normal
  ambientTemperatureReduced: number.mosquitto_mqtt_broker_raumsolltemperatur_reduziert
  ambientTemperatureParty: number.mosquitto_mqtt_broker_raumsolltemperatur_party
  supplyTemperature: sensor.mosquitto_mqtt_broker_information_allgemein_anlagenvorlauftemperatur_0_95
  hpRunning: binary_sensor.mosquitto_mqtt_broker_status_primaerquelle
  compressorRunning: binary_sensor.mosquitto_mqtt_broker_status_verdichter
  heatingCircuitPumpRunning: binary_sensor.mosquitto_mqtt_broker_information_heizkreis_hk2_heizkreispumpe_0_1
  circulatingPumpRunning: binary_sensor.mosquitto_mqtt_broker_status_zirklulationspumpe_2
  tankTempHPUp: sensor.mosquitto_mqtt_broker_information_allgemein_pufferspeichertemperatur_0_95
  tankTempWWUp: sensor.mosquitto_mqtt_broker_warmwassertemperatur_ist_oben
  supplyTemperatureHeating: sensor.mosquitto_mqtt_broker_information_heizkreis_hk2_vorlauftemperatur_sekundaer_2_0_95
  evaporatorPressure: sensor.mosquitto_mqtt_broker_druck_im_verdampfer
  evaporatorTemperature: sensor.mosquitto_mqtt_broker_temperatur_verdampfer
  condenserPressure: sensor.mosquitto_mqtt_broker_druck_im_kondensator
  wwHeatingValve: binary_sensor.mosquitto_mqtt_broker_diagnose_waermepumpe_3_w_ventil_heizen_ww1_0_heizen_1_ww
  heaterRodWW: switch.mosquitto_mqtt_broker_freigabe_elektroheizung_fuer_ww_bereitung
  heaterRodHP: switch.mosquitto_mqtt_broker_freigabe_heizen_mit_elektro
  heaterRodLevel1: binary_sensor.mosquitto_mqtt_broker_status_heizstab_stufe_1
  heaterRodLevel2: binary_sensor.mosquitto_mqtt_broker_status_heizstab_stufe_2
  linkDetails: ./hp-details
  linkSettings: ./hp-settings
```
