# Heat Pump card

Home Assistant dashboard card displaying heat pump parameters

![Example picture of the heat pump card.](https://github.com/ManfredTremmel/home-assistant-heat-pump-card/raw/master/dist/heat-pump-card/heat-pump.svg?raw=true)

**Options**

| Name | Type | Requirement | Default | Description
| ---- | ---- | ----------- | ------- | -----------
| heatingPumpStatusOnOff | object | **Required** | binary_sensor.heating_pump_status_on_off | if heating pump is off, power symbol is displayed
| heatingPumpHotWaterMode | object | **Required** | binary_sensor.heating_pump_hot_water_mode | Hot Water Mode, when on, faucet symbol is displayed
| heatingPumpHeatingMode | object | **Required** | binary_sensor.heating_pump_heating_mode | if Heating Mode is on, radiator symbol is displayed
| heatingPumpCoolingMode | object | **Required** | binary_sensor.heating_pump_cooling_mode | in Cooling Mode, the cooling symbol is displayed
| heatingPumpPartyMode | object | **Required** | binary_sensor.heating_pump_party_mode | in Party Mode the drinking glass symbol and `ambientTemperatureParty` (when set) is displayed
| heatingPumpEnergySaveMode | object | **Required** | binary_sensor.heating_pump_energy_save_mode | in Energy Saving Mode the piggybank symbol and `ambientTemperatureReduced` (when set) is displayed
| heatingPumpNightMode | object | **Required** | binary_sensor.heating_pump_night_mode | Night Mode switches between sun and moon symbol
| outdoorTemperature | object | **Required** | sensor.mosquitto_mqtt_broker_aussentemperatur | Outdoor Temperature
| ambientTemperatureNormal | object | **Required** | number.mosquitto_mqtt_broker_raumsolltemperatur_normal | Ambient Temperature normal
| ambientTemperatureReduced | object | optional | number.mosquitto_mqtt_broker_raumsolltemperatur_reduziert | Ambient Temperature reduced (used when `heatingPumpEnergySaveMode` is on)
| ambientTemperatureParty | object | optional | number.mosquitto_mqtt_broker_raumsolltemperatur_party | Ambient Temperature Party (used when `heatingPumpPartyMode` is on)
| supplyTemperature | object | optional | sensor.mosquitto_mqtt_broker_information_allgemein_anlagenvorlauftemperatur_0_95 | Supply Temperature
| hpRunning | object | **Required** | binary_sensor.mosquitto_mqtt_broker_status_primaerquelle | When Primary Source is active, the fan animation is running
| compressorRunning | object | **Required** | binary_sensor.mosquitto_mqtt_broker_status_verdichter | Binary sensor which detects if Compressor is running
| heatingCircuitPumpRunning | object | **Required** | binary_sensor.mosquitto_mqtt_broker_information_heizkreis_hk2_heizkreispumpe_0_1 | Binary sensor which detects if Heating Circuit Pump is running
| circulatingPumpRunning | object | **Required** | binary_sensor.mosquitto_mqtt_broker_status_zirklulationspumpe_2 | Binary sensor which detects if Circulating Pump is running
| tankTempHPUp | object | **Required** | sensor.mosquitto_mqtt_broker_information_allgemein_pufferspeichertemperatur_0_95 | Buffer Temperature up
| tankTempHPMiddle | object | optional |  | Buffer Temperature middle
| tankTempHPDown | object | optional |  | Buffer Temperature down
| tankTempWWUp | object | **Required** | sensor.mosquitto_mqtt_broker_warmwassertemperatur_ist_oben | Hot Water Buffer Temperature up
| tankTempWWMiddle | object | optional |  | Hot Water Buffer Temperature middle
| tankTempWWDown | object | optional |  | Hot Water Buffer Temperature down
| supplyTemperatureHeating | object | **Required** | sensor.mosquitto_mqtt_broker_information_heizkreis_hk2_vorlauftemperatur_sekundaer_2_0_95 | Supply Temperature Heating
| refluxTemperatureHeating | object | optional |  | Reflux Temperature Heating
| evaporatorPressure | object | optional | sensor.mosquitto_mqtt_broker_druck_im_verdampfer | Evaporator Pressure
| evaporatorTemperature | object | optional | sensor.mosquitto_mqtt_broker_temperatur_verdampfer | Evaporator Temperature
| condenserPressure | object | optional | sensor.mosquitto_mqtt_broker_druck_im_kondensator | Condenser Pressure
| wwHeatingValve | object | **Required** | binary_sensor.mosquitto_mqtt_broker_diagnose_waermepumpe_3_w_ventil_heizen_ww1_0_heizen_1_ww | Heating/Hot Water Valve
| heaterRodWW | object | optional | switch.mosquitto_mqtt_broker_freigabe_elektroheizung_fuer_ww_bereitung | Heater Rod Hot Water is active
| heaterRodHP | object | optional | switch.mosquitto_mqtt_broker_freigabe_heizen_mit_elektro | Heater Rod Heating is active
| heaterRodLevel1 | object | optional | binary_sensor.mosquitto_mqtt_broker_status_heizstab_stufe_1 | Heater Rod is using Level 1
| heaterRodLevel2 | object | optional | binary_sensor.mosquitto_mqtt_broker_status_heizstab_stufe_2 | Heater Rod is using Level 2
| linkDetails | string | **Required** | ./hp-details | Link to details page
| linkSettings | string | **Required** | ./hp-settings | Link to settings page


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
