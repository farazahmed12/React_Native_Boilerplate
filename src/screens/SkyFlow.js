import React from 'react';
import {Button, View} from 'react-native';
import {
  CardNumberElement,
  CvvElement,
  ExpirationDateElement,
  SkyflowProvider,
  useCollectContainer,
} from 'skyflow-react-native';

const CollectForm = () => {
  const container = useCollectContainer();

  const handleSubmit = async () => {
    try {
      const response = await container.collect();
      console.log('Skyflow tokenized data:', response);
      // send response.records to your backend
    } catch (err) {
      console.error('Collect error:', err);
    }
  };

  return (
    <View style={{padding: 20}}>
      <CardNumberElement
        container={container} // 👈 attach container
        table="cards"
        column="card_number"
        placeholder="Card Number"
      />
      <ExpirationDateElement
        container={container} // 👈 attach container
        table="cards"
        column="expiry_date"
        placeholder="MM/YY"
      />
      <CvvElement
        container={container} // 👈 attach container
        table="cards"
        column="cvv"
        placeholder="CVV"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const SkyFlowScreen = () => {
  return (
    <SkyflowProvider>
      <CollectForm />
    </SkyflowProvider>
  );
};

export default SkyFlowScreen;
