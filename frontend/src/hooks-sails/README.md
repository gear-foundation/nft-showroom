# Sails-js Migration Guide

Этот документ описывает процесс миграции с устаревшей реализации на sails-js.

## Основные изменения

### 1. Замена хуков

| Старый хук       | Новый хук                   | Описание                               |
|------------------|-----------------------------|----------------------------------------|
| `useReadState`   | `useProgramQuery`           | Чтение состояния программы             |
| `useSendMessage` | `useSendProgramTransaction` | Отправка сообщений                     |
| -                | `useProgramEvent`           | Подписка на события (новый функционал) |

### 2. Новые файлы

- `lib.ts` - Основной класс SailsProgram с методами для работы с программой
- `api.ts` - React хуки для интеграции с sails-js
- `index.ts` - Экспорт всех модулей
- `example.tsx` - Пример использования новых хуков

## Использование

### Импорт

```typescript
import {
  useSailsProgram,
  useProgramState,
  useConfig,
  useCollectionInfo,
  useAllCollections,
  useCollectionsInfo,
  useSendTransaction,
  useProgramEvents,
  type ActorId,
  type Config,
  type StorageState,
} from './hooks-sails';
```

### Создание экземпляра программы

```typescript
const sailsProgram = useSailsProgram(programId);
```

### Чтение состояния

```typescript
// Старый способ
const { state } = useReadState(programId, 'All');

// Новый способ
const { data: programState, isLoading, error } = useProgramState(programId);
```

### Отправка транзакций

```typescript
// Старый способ
const { send } = useSendMessage(programId);

// Новый способ
const { send, isLoading, error } = useSendTransaction();

// Создание транзакции
const transaction = sailsProgram.nftShowroom.mint(collectionAddress);
await send(transaction);
```

### Подписка на события

```typescript
const events = useProgramEvents(programId);

const unsubscribe = events.useInitializedEvent((data) => {
  console.log('Program initialized:', data);
});

// Отписка
unsubscribe();
```

## Доступные методы

### Чтение данных

- `useProgramState(programId, originAddress?)` - Получение состояния программы
- `useConfig(programId, originAddress?)` - Получение конфигурации
- `useCollectionInfo(programId, collectionAddress, originAddress?)` - Информация о коллекции
- `useAllCollections(programId, originAddress?)` - Все коллекции
- `useCollectionsInfo(programId, originAddress?)` - Информация о типах коллекций

### Отправка транзакций

- `useSendTransaction()` - Хук для отправки транзакций

### События

- `useInitializedEvent(callback)` - Событие инициализации
- `useCollectionCreatedEvent(callback)` - Создание коллекции
- `useMintedEvent(callback)` - Минтинг NFT
- `useSaleNftEvent(callback)` - Продажа NFT
- `useNftSoldEvent(callback)` - NFT продан
- `useAuctionCreatedEvent(callback)` - Создание аукциона
- `useAuctionClosedEvent(callback)` - Закрытие аукциона
- `useBidAddedEvent(callback)` - Добавление ставки
- `useOfferCreatedEvent(callback)` - Создание предложения
- `useOfferAcceptedEvent(callback)` - Принятие предложения

## Миграция существующего кода

### 1. Замените импорты

```typescript
// Было
import { useReadState, useSendMessage } from '@gear-js/react-hooks';

// Стало
import { useProgramState, useSendTransaction } from './hooks-sails';
```

### 2. Обновите хуки

```typescript
// Было
const { state } = useReadState(programId, 'All');
const { send } = useSendMessage(programId);

// Стало
const { data: programState, isLoading, error } = useProgramState(programId);
const { send, isLoading: sendLoading, error: sendError } = useSendTransaction();
```

### 3. Обновите обработку ошибок

```typescript
// Было
if (error) {
  console.error('Error:', error);
}

// Стало
if (error) {
  console.error('Error:', error);
}
```

## Пример полной миграции

Смотрите файл `example.tsx` для полного примера использования всех новых хуков.

## Примечания

1. Все хуки возвращают объекты с полями `data`, `isLoading`, `error`
2. События теперь доступны через отдельные хуки
3. Типы данных строго типизированы
4. Поддержка TypeScript из коробки

## Проблемы и решения

### Type instantiation is excessively deep

Если вы столкнулись с этой ошибкой TypeScript, используйте приведение типов:

```typescript
const result = (registry as any).createType(typeString, payload)[2].toJSON();
```

### Неизвестные типы

Убедитесь, что все необходимые типы импортированы из `./types`:

```typescript
import type { ActorId, Config, StorageState } from './types';
``` 
