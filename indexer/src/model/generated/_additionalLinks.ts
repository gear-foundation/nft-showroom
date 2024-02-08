import * as marshal from './marshal';

export class AdditionalLinks {
  private _externalUrl!: string | undefined | null;
  private _telegram!: string | undefined | null;
  private _xcom!: string | undefined | null;
  private _medium!: string | undefined | null;
  private _discord!: string | undefined | null;

  constructor(props?: Partial<Omit<AdditionalLinks, 'toJSON'>>, json?: any) {
    Object.assign(this, props);
    if (json != null) {
      this._externalUrl =
        json.externalUrl == null
          ? undefined
          : marshal.string.fromJSON(json.externalUrl);
      this._telegram =
        json.telegram == null
          ? undefined
          : marshal.string.fromJSON(json.telegram);
      this._xcom =
        json.xcom == null ? undefined : marshal.string.fromJSON(json.xcom);
      this._medium =
        json.medium == null ? undefined : marshal.string.fromJSON(json.medium);
      this._discord =
        json.discord == null
          ? undefined
          : marshal.string.fromJSON(json.discord);
    }
  }

  get externalUrl(): string | undefined | null {
    return this._externalUrl;
  }

  set externalUrl(value: string | undefined | null) {
    this._externalUrl = value;
  }

  get telegram(): string | undefined | null {
    return this._telegram;
  }

  set telegram(value: string | undefined | null) {
    this._telegram = value;
  }

  get xcom(): string | undefined | null {
    return this._xcom;
  }

  set xcom(value: string | undefined | null) {
    this._xcom = value;
  }

  get medium(): string | undefined | null {
    return this._medium;
  }

  set medium(value: string | undefined | null) {
    this._medium = value;
  }

  get discord(): string | undefined | null {
    return this._discord;
  }

  set discord(value: string | undefined | null) {
    this._discord = value;
  }

  toJSON(): object {
    return {
      externalUrl: this.externalUrl,
      telegram: this.telegram,
      xcom: this.xcom,
      medium: this.medium,
      discord: this.discord,
    };
  }
}
