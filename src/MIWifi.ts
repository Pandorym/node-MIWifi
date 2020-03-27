import axios from 'axios';
import * as qs from 'qs';
import { Crypto } from 'cryptojs';

export class MIWifi {
  static BASE_URL = 'http://miwifi.com';

  static Username = 'admin';
  static Password: string;
  static Nonce: string;
  static Stok: string;

  static key: string;
  static iv: string;
  static deviceId: string;

  static async Login(Password: string) {
    MIWifi.Password = Password;

    // Step 1
    let HTML = await axios.get(MIWifi.BASE_URL + '/cgi-bin/luci/web/')
                          .then(x => x.data);
    MIWifi.key = /(?<=key: ')\S*?(?=')/.exec(HTML)[0];
    MIWifi.iv = /(?<=iv: ')\S*?(?=')/.exec(HTML)[0];
    MIWifi.deviceId = /(?<=var deviceId = ')\S*?(?=')/.exec(HTML)[0];

    // Step 2
    let LoginRes = await axios.request({
      method : 'POST',
      url : MIWifi.BASE_URL + '/cgi-bin/luci/api/xqsystem/login',
      headers : { 'content-type' : 'application/x-www-form-urlencoded' },
      data : qs.stringify({
        username : 'admin',
        logtype : 2,
        nonce : MIWifi.nonceCreat(),
        password : MIWifi.oldPwd()
      })
    });

    // Step 3
    MIWifi.Stok = LoginRes.data.token;
  }

  static async PPPoE_Stop() {
    return axios.get(MIWifi.BASE_URL + '/cgi-bin/luci/;stok=' + MIWifi.Stok + '/api/xqnetwork/pppoe_stop')
                .then(res => res.data.code === 0);
  }

  static async PPPoE_Connect() {
    return axios.get(MIWifi.BASE_URL + '/cgi-bin/luci/;stok=' + MIWifi.Stok + '/api/xqnetwork/pppoe_start')
                .then(res => res.data.code === 0);
  }

  static nonceCreat() {
    let type = 0;
    let time = Math.floor(new Date().getTime() / 1000);
    let random = Math.floor(Math.random() * 10000);
    return MIWifi.Nonce = [type, MIWifi.deviceId, time, random].join('_');
  }

  static oldPwd() {
    return Crypto.SHA1(MIWifi.Nonce + Crypto.SHA1(MIWifi.Password + MIWifi.key).toString()).toString();
  }
}
