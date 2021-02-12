import { useState, useMemo } from 'react';
import { Row, Col, Card, Form, Button } from 'antd';
import styled from 'styled-components';

import InputNumber from 'InputNumber';
import { formatAmount } from 'utils';

function App() {
  const [form] = Form.useForm();

  const [amountSpent, setAmountSpent] = useState();
  const [sellPrice, setSellPrice] = useState();
  const [feeRate, setFeeRate] = useState(0.25);
  const [totalReceived, setTotalReceived] = useState();

  const sellAmount = useMemo(() => {
    return (totalReceived * sellPrice * (100 - feeRate)) / 100;
  }, [sellPrice, totalReceived, feeRate, form]);

  const margin = useMemo(() => {
    return sellAmount - amountSpent;
  }, [sellAmount, amountSpent]);

  const marginPercentage = useMemo(() => {
    return ((sellAmount - amountSpent) / amountSpent) * 100;
  }, [sellAmount, amountSpent]);

  const handleOnChangeSell = (num) => {
    setSellPrice(num);
  };

  const handleOnChangeFee = (num) => {
    setFeeRate(num);
  };

  const handleOnChangeAmount = (num) => {
    setAmountSpent(num);
  };

  const handleOnReset = () => {
    form.resetFields();
    setAmountSpent();
    setSellPrice();
    setFeeRate(0.25);
    setTotalReceived();
  };

  return (
    <Wrapper>
      <Row>
        <Col
          xs={{ offset: 2, span: 20 }}
          md={{ offset: 6, span: 12 }}
          lg={{ offset: 8, span: 8 }}
          className="content"
        >
          <div className="title">May The Force Be With You.</div>
          <Card>
            <Form layout="vertical" form={form}>
              <Form.Item name="amount" label="Amount spent">
                <InputNumber
                  width="100%"
                  onChange={handleOnChangeAmount}
                  formatter={formatAmount}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="buyPrice"
                    label="Buying Price"
                    className="buy"
                  >
                    <InputNumber
                      width="100%"
                      formatter={formatAmount}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="sellPrice"
                    label="Selling Price"
                    className="sell"
                  >
                    <InputNumber
                      width="100%"
                      onChange={handleOnChangeSell}
                      formatter={formatAmount}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="fee" label="Fee" initialValue={0.25}>
                <InputNumber onChange={handleOnChangeFee} />
              </Form.Item>
              <Form.Item
                noStyle
                dependencies={['amount', 'fee', 'buyPrice', 'sellPrice']}
              >
                {({ getFieldValue }) => {
                  const amount = getFieldValue('amount');
                  const fee = getFieldValue('fee');
                  const buy = getFieldValue('buyPrice');

                  const total = (amount * (100 - fee)) / 100 / buy;
                  setTotalReceived(total);

                  return (
                    <Form.Item label="Total Received">
                      <InputNumber
                        value={!isNaN(total) ? total : undefined}
                        width="100%"
                        disabled
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Form>
            <div className="margin">
              <div>Sell Amount: {formatAmount(sellAmount.toFixed(2))} THB</div>
              <div>Margin: {formatAmount(margin.toFixed(2))} THB</div>
              <div>Percent: {formatAmount(marginPercentage.toFixed(2))} %</div>
            </div>
            <div className="button">
              <Button size="large" onClick={handleOnReset}>
                Reset
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 70px 0;

  .title {
    text-align: center;
    margin-bottom: 10px;
  }

  .buy {
    .ant-form-item-label {
      label {
        color: green;
      }
    }
  }

  .sell {
    .ant-form-item-label {
      label {
        color: red;
      }
    }
  }

  .button {
    margin-top: 20px;
  }
`;

export default App;
