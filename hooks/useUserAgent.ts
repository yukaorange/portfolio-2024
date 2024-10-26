'use client';

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { browserState, osState, deviceState, iphoneState } from '@/store/userAgentAtom';

export const useUserAgent = () => {
  const setBrowser = useSetRecoilState(browserState);
  const setOS = useSetRecoilState(osState);
  const setDevice = useSetRecoilState(deviceState);
  const setIphone = useSetRecoilState(iphoneState);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();

    // ブラウザのチェック
    if (ua.includes('edge') || ua.includes('edga') || ua.includes('edgios')) {
      setBrowser('edge');
    } else if (ua.includes('opera') || ua.includes('opr')) {
      setBrowser('opera');
    } else if (ua.includes('samsungbrowser')) {
      setBrowser('samsung');
    } else if (ua.includes('ucbrowser')) {
      setBrowser('uc');
    } else if (ua.includes('chrome') || ua.includes('crios')) {
      setBrowser('chrome');
    } else if (ua.includes('firefox') || ua.includes('fxios')) {
      setBrowser('firefox');
    } else if (ua.includes('safari')) {
      setBrowser('safari');
    } else if (ua.includes('msie') || ua.includes('trident')) {
      setBrowser('ie');
      alert('このブラウザは現在サポートされておりません。');
    }

    // OSのチェック
    if (ua.includes('windows nt')) {
      setOS('windows');
    } else if (ua.includes('android')) {
      setOS('android');
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
      setOS('ios');
    } else if (ua.includes('mac os x')) {
      setOS('macos');
    }

    // デバイスのチェック
    if (ua.includes('iphone') || (ua.includes('android') && ua.includes('mobile'))) {
      setDevice('mobile');
    } else if (ua.includes('ipad') || ua.includes('android')) {
      setDevice('tablet');
    } else if (ua.includes('ipad') || (ua.includes('macintosh') && 'ontouchend' in document)) {
      setDevice('tablet');
    } else {
      setDevice('pc');
    }

    // iPhoneのチェック
    if (ua.includes('iphone')) {
      setIphone('iphone');
    }

    // bodyにクラスを追加
    const addClassToBody = (className: string) => {
      if (className) document.body.classList.add(className);
    };

    setBrowser((browser) => {
      addClassToBody(browser);
      return browser;
    });
    setOS((os) => {
      addClassToBody(os);
      return os;
    });
    setDevice((device) => {
      addClassToBody(device);
      return device;
    });
    setIphone((iphone) => {
      addClassToBody(iphone);
      return iphone;
    });
  }, [setBrowser, setOS, setDevice, setIphone]);
};
