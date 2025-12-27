// adduwebui/utils/addEventListener.tsx

export type WebEventSubscription = {
  remove: () => void;
};

export function addEventListener<
  T extends {
    addEventListener: (
      event: string,
      handler: EventListenerOrEventListenerObject
    ) => void;
    removeEventListener?: (
      event: string,
      handler: EventListenerOrEventListenerObject
    ) => void;
  }
>(
  Module: T,
  eventName: string,
  handler: EventListenerOrEventListenerObject
): WebEventSubscription {
  Module.addEventListener(eventName, handler);

  let removed = false;

  return {
    remove: () => {
      if (removed) return;
      Module.removeEventListener?.(eventName, handler);
      removed = true;
    },
  };
}

export function addListener<
  T extends {
    addEventListener: (
      event: string,
      handler: EventListenerOrEventListenerObject
    ) => void;
    removeEventListener: (
      event: string,
      handler: EventListenerOrEventListenerObject
    ) => void;
  }
>(
  Module: T,
  eventName: string,
  handler: EventListenerOrEventListenerObject
): WebEventSubscription {
  Module.addEventListener(eventName, handler);

  let removed = false;

  return {
    remove: () => {
      if (removed) return;
      Module.removeEventListener(eventName, handler);
      removed = true;
    },
  };
}
