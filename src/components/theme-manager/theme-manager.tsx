require('./theme-manager.scss');
import * as React from 'react';
import { autobind, debounce } from "core-decorators";
import { __i18n } from "../../extension/i18n";
import { connect } from "../../store/connect";
import { TextField, Checkbox, ColorPicker, Slider, Select, Option, Button } from '../ui'
import { ISettingsState } from '../settings'
import { IThemeManagerState, Font, fontsList, defaultTheme, themeManagerActions } from './index'
import { Translation } from "../../vendors";
import { Popup } from '../popup'
import isEqual = require("lodash/isEqual");

interface Props {
  theme?: IThemeManagerState
  settings?: ISettingsState
}

@connect(state => ({
  theme: state.theme,
  settings: state.settings,
}))
export class ThemeManager extends React.Component<Props, {}> {
  private translation: Translation = {
    vendor: this.props.settings.vendor,
    langFrom: this.props.settings.langFrom,
    langTo: this.props.settings.langTo,
    translation: __i18n("popup_demo_translation"),
    dictionary: [
      {
        wordType: __i18n("popup_demo_dictionary_noun"),
        meanings: [
          {
            word: __i18n("popup_demo_dictionary_values"),
            translation: []
          }
        ]
      }
    ]
  };

  save(state: IThemeManagerState) {
    this.setState(state);
    this.sync();
  }

  @debounce(1000)
  sync() {
    themeManagerActions.sync(this.state);
  }

  @autobind()
  reset() {
    this.setState(defaultTheme);
    themeManagerActions.reset();
  }

  render() {
    var settings = this.props.settings;
    var theme = Object.assign({}, this.props.theme, this.state);
    var isDefault = isEqual(defaultTheme, this.props.theme);
    return (
        <div className="ThemeManager">
          <div className="preview flex center pb1">
            <Popup translation={this.translation} settings={settings} theme={theme}/>
          </div>
          <div className="theme">
            <div className="flex auto">
              <div className="box">
                <span className="sub-title">{__i18n("sub_header_background")}</span>
                <div className="flex gaps align-center pl1">
                  <span className="heading">{__i18n("background_color")}</span>
                  <div className="flex align-center">
                    <ColorPicker value={theme.bgcMain} onChange={v => this.save({bgcMain: v})}/>
                    <ColorPicker value={theme.bgcSecondary}
                                 onChange={v => this.save({bgcSecondary: v})}
                                 disabled={!theme.bgcLinear}/>
                  </div>
                  <Checkbox label={__i18n("background_linear_gradient")}
                            checked={theme.bgcLinear}
                            onChange={v => this.save({bgcLinear: v})}/>
                </div>
              </div>
              <div className="box">
                <span className="sub-title">{__i18n("sub_header_box_shadow")}</span>
                <div className="flex gaps align-center">
                  <TextField
                      className="box grow"
                      type="number" min={0} max={100}
                      value={theme.boxShadowBlur}
                      onChange={v => this.save({boxShadowBlur: v})}/>
                  <span className="heading">{__i18n("box_shadow_color")}</span>
                  <ColorPicker
                      position="bottom right"
                      value={theme.boxShadowColor}
                      onChange={v => this.save({boxShadowColor: v})}/>
                  <Checkbox checked={theme.boxShadowInner}
                            onChange={v => this.save({boxShadowInner: v})}
                            label={__i18n("box_shadow_inner")}/>
                </div>
              </div>
            </div>

            <span className="sub-title">{__i18n("sub_header_text")}</span>
            <div className="flex gaps align-center">
              <span className="heading">{__i18n("text_color")}</span>
              <ColorPicker
                  value={theme.textColor}
                  onChange={v => this.save({textColor: v})}/>
              <span className="heading">{__i18n("text_size")}</span>
              <TextField type="number" min={10} max={100}
                         value={theme.fontSize}
                         onChange={v => this.save({fontSize: v})}/>
              <span className="heading">{__i18n("text_font_family")}</span>
              <Select className="box grow" value={theme.fontFamily} onChange={v => this.save({fontFamily: v})}>
                {fontsList.map((font: Font, i) => <Option key={i} value={font.font}/>)}
              </Select>
            </div>
            <div className="flex gaps align-center">
              <span className="heading">{__i18n("text_shadow")}</span>
              <TextField type="number" min={0} max={50}
                         value={theme.textShadowRadius}
                         onChange={v => this.save({textShadowRadius: v})}
                         title={__i18n("text_shadow_size")} className="box grow"/>
              <TextField type="number" min={-50} max={50}
                         value={theme.textShadowOffsetX}
                         onChange={v => this.save({textShadowOffsetX: v})}
                         title={__i18n("text_shadow_offset_x")} className="box grow"/>
              <TextField type="number" min={-50} max={50}
                         value={theme.textShadowOffsetY}
                         onChange={v => this.save({textShadowOffsetY: v})}
                         title={__i18n("text_shadow_offset_y")} className="box grow"/>
              <span className="heading">{__i18n("text_shadow_color")}</span>
              <ColorPicker
                  position="bottom right"
                  value={theme.textShadowColor}
                  onChange={v => this.save({textShadowColor: v})}/>
            </div>

            <span className="sub-title">{__i18n("sub_header_border")}</span>
            <div className="flex gaps align-center">
              <span className="heading">{__i18n("border_width")}</span>
              <TextField type="number" min={0} max={100}
                         value={theme.borderWidth}
                         onChange={v => this.save({borderWidth: v})}/>
              <span className="heading">{__i18n("border_style")}</span>
              <Select className="box grow"
                      value={theme.borderStyle}
                      onChange={v => this.save({borderStyle: v})}>
                <Option value="solid"/>
                <Option value="dotted"/>
                <Option value="dashed"/>
                <Option value="double"/>
                <Option value="groove"/>
                <Option value="ridge"/>
                <Option value="inset"/>
                <Option value="outset"/>
              </Select>
              <span className="heading">{__i18n("border_color")}</span>
              <ColorPicker
                  position="bottom right"
                  value={theme.borderColor}
                  onChange={v => this.save({borderColor: v})}/>
            </div>
            <div className="flex gaps align-center">
              <span className="heading">{__i18n("border_radius")}</span>
              <Slider min={0} max={50}
                      value={theme.borderRadius}
                      onChange={v => this.save({borderRadius: v})}
                      className="box grow"/>
            </div>

            <span className="sub-title">{__i18n("sub_header_box_size")}</span>
            <div className="flex gaps align-center">
              <span className="heading">{__i18n("box_size_min_width")}</span>
              <Slider min={0} max={1000}
                      value={theme.minWidth}
                      onChange={v => this.save({minWidth: v})}
                      className="box grow"/>
              <span className="heading">{__i18n("box_size_min_height")}</span>
              <Slider min={0} max={1000}
                      value={theme.minHeight}
                      onChange={v => this.save({minHeight: v})}
                      className="box grow"/>
            </div>
            <div className="flex gaps align-center">
              <span className="heading">{__i18n("box_size_max_width")}</span>
              <Slider min={0} max={1000}
                      value={theme.maxWidth}
                      onChange={v => this.save({maxWidth: v})}
                      className="box grow"/>
              <span className="heading">{__i18n("box_size_max_height")}</span>
              <Slider min={0} max={1000}
                      value={theme.maxHeight}
                      onChange={v => this.save({maxHeight: v})}
                      className="box grow"/>
            </div>
          </div>
          <div className="reset flex center pt2">
            <Button label={__i18n("reset_to_default_button_text")} accent
                    disabled={isDefault}
                    onClick={this.reset}/>
          </div>
        </div>
    );
  }
}

export default ThemeManager;