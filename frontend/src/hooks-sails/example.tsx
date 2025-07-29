import React from 'react';
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
} from './index';

// Пример компонента, использующего новые хуки
export const SailsExample: React.FC<{ programId: `0x${string}` }> = ({ programId }) => {
  // Создание экземпляра SailsProgram
  const sailsProgram = useSailsProgram(programId);
  
  // Чтение состояния программы (заменяет useReadState)
  const { data: programState, isLoading: stateLoading, error: stateError } = useProgramState(programId);
  
  // Получение конфигурации
  const { data: config, isLoading: configLoading, error: configError } = useConfig(programId);
  
  // Получение информации о коллекции
  const collectionAddress: ActorId = '0x1234567890123456789012345678901234567890123456789012345678901234';
  const { data: collectionInfo, isLoading: collectionLoading, error: collectionError } = useCollectionInfo(
    programId,
    collectionAddress,
  );
  
  // Получение всех коллекций
  const { data: allCollections, isLoading: collectionsLoading, error: collectionsError } = useAllCollections(programId);
  
  // Получение информации о типах коллекций
  const { data: collectionsInfo, isLoading: typesLoading, error: typesError } = useCollectionsInfo(programId);
  
  // Хук для отправки транзакций (заменяет useSendMessage)
  const { send, isLoading: sendLoading, error: sendError } = useSendTransaction();
  
  // Хуки для подписки на события
  const events = useProgramEvents(programId);
  
  // Пример использования событий
  React.useEffect(() => {
    const unsubscribeInitialized = events.useInitializedEvent((data) => {
      console.log('Program initialized:', data);
    });
    
    const unsubscribeCollectionCreated = events.useCollectionCreatedEvent((data) => {
      console.log('Collection created:', data);
    });
    
    const unsubscribeMinted = events.useMintedEvent((data) => {
      console.log('NFT minted:', data);
    });
    
    return () => {
      unsubscribeInitialized();
      unsubscribeCollectionCreated();
      unsubscribeMinted();
    };
  }, []);
  
  // Пример отправки транзакции
  const handleMint = async () => {
    if (!sailsProgram) return;
    
    try {
      // Создание транзакции для минтинга
      const transaction = sailsProgram.nftShowroom.mint(collectionAddress);
      
      // Отправка транзакции
      await send();
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };
  
  if (stateLoading || configLoading || collectionLoading || collectionsLoading || typesLoading) {
    return <div>Loading...</div>;
  }
  
  if (stateError || configError || collectionError || collectionsError || typesError) {
    return <div>Error loading data</div>;
  }
  
  return (
    <div>
      <h1>Sails-js Integration Example</h1>
      
      <div>
        <h2>Program State</h2>
        <pre>{JSON.stringify(programState, null, 2)}</pre>
      </div>
      
      <div>
        <h2>Config</h2>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
      
      <div>
        <h2>Collection Info</h2>
        <pre>{JSON.stringify(collectionInfo, null, 2)}</pre>
      </div>
      
      <div>
        <h2>All Collections</h2>
        <pre>{JSON.stringify(allCollections, null, 2)}</pre>
      </div>
      
      <div>
        <h2>Collections Info</h2>
        <pre>{JSON.stringify(collectionsInfo, null, 2)}</pre>
      </div>
      
      <button onClick={handleMint} disabled={sendLoading}>
        {sendLoading ? 'Minting...' : 'Mint NFT'}
      </button>
      
      {sendError && <div>Error: {String(sendError)}</div>}
    </div>
  );
}; 