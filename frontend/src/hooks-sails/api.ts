import { useApi } from '@gear-js/react-hooks';
import { ActorId } from 'sails-js';

import { SailsProgram } from './lib';

// Hook для создания экземпляра SailsProgram
export const useSailsProgram = (programId?: `0x${string}`) => {
  const { api } = useApi();

  if (!api) {
    return null;
  }

  return new SailsProgram(api, programId);
};

// Hook для чтения состояния программы (заменяет useReadState)
export const useProgramState = (programId: `0x${string}`, originAddress?: string) => {
  const sailsProgram = useSailsProgram(programId);

  if (!sailsProgram) {
    return { data: undefined, isLoading: false, error: null };
  }

  // Здесь нужно будет использовать правильный хук для чтения состояния
  // Пока возвращаем заглушку
  return { data: undefined, isLoading: false, error: null };
};

// Hook для получения конфигурации
export const useConfig = (programId: `0x${string}`, originAddress?: string) => {
  const sailsProgram = useSailsProgram(programId);

  if (!sailsProgram) {
    return { data: undefined, isLoading: false, error: null };
  }

  // Здесь нужно будет использовать правильный хук для чтения состояния
  // Пока возвращаем заглушку
  return { data: undefined, isLoading: false, error: null };
};

// Hook для получения информации о коллекции
export const useCollectionInfo = (programId: `0x${string}`, collectionAddress: ActorId, originAddress?: string) => {
  const sailsProgram = useSailsProgram(programId);

  if (!sailsProgram) {
    return { data: undefined, isLoading: false, error: null };
  }

  // Здесь нужно будет использовать правильный хук для чтения состояния
  // Пока возвращаем заглушку
  return { data: undefined, isLoading: false, error: null };
};

// Hook для получения всех коллекций
export const useAllCollections = (programId: `0x${string}`, originAddress?: string) => {
  const sailsProgram = useSailsProgram(programId);

  if (!sailsProgram) {
    return { data: undefined, isLoading: false, error: null };
  }

  // Здесь нужно будет использовать правильный хук для чтения состояния
  // Пока возвращаем заглушку
  return { data: undefined, isLoading: false, error: null };
};

// Hook для получения информации о типах коллекций
export const useCollectionsInfo = (programId: `0x${string}`, originAddress?: string) => {
  const sailsProgram = useSailsProgram(programId);

  if (!sailsProgram) {
    return { data: undefined, isLoading: false, error: null };
  }

  // Здесь нужно будет использовать правильный хук для чтения состояния
  // Пока возвращаем заглушку
  return { data: undefined, isLoading: false, error: null };
};

// Hook для отправки транзакций (заменяет useSendMessage)
export const useSendTransaction = () => {
  // Здесь нужно будет использовать правильный хук для отправки транзакций
  // Пока возвращаем заглушку
  return {
    send: async () => {
      throw new Error('Not implemented yet');
    },
    isLoading: false,
    error: null,
  };
};

// Hook для подписки на события (новый функционал)
export const useProgramEvents = (programId: `0x${string}`) => {
  const sailsProgram = useSailsProgram(programId);

  return {
    // Подписка на событие инициализации
    useInitializedEvent: (callback: (data: never) => void) => {
      if (!sailsProgram) {
        return () => {};
      }

      // Здесь нужно будет использовать правильный хук для подписки на события
      // Пока возвращаем заглушку
      return () => {};
    },

    // Подписка на событие создания коллекции
    useCollectionCreatedEvent: (callback: (data: never) => void) => {
      if (!sailsProgram) {
        return () => {};
      }

      // Здесь нужно будет использовать правильный хук для подписки на события
      // Пока возвращаем заглушку
      return () => {};
    },

    // Подписка на событие минтинга
    useMintedEvent: (callback: (data: never) => void) => {
      if (!sailsProgram) {
        return () => {};
      }

      // Здесь нужно будет использовать правильный хук для подписки на события
      // Пока возвращаем заглушку
      return () => {};
    },
  };
};
