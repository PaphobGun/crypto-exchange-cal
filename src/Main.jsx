import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Radio, Card, InputNumber, Statistic, Button } from 'antd';
import axios from 'axios';

import { formatAmount, parserFormatAmount } from 'utils';

const EXCHANGE = {
  BITKUB: 'BITKUB',
  BINANCE: 'BINANCE',
};

const initialFormValues = {
  amount: 0,
  buy: 0,
  sell: 0,
  fee: 0.25,
};

const isBinance = (exchange) => {
  return exchange === EXCHANGE.BINANCE;
};

function Main() {
  const [USDTPrice, setUSDTPrice] = useState(0);
  const [exchange, setExchange] = useState(EXCHANGE.BITKUB);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [displayedCurrency, setDisplayedCurrentcy] = useState('THB');
  const [totalReceived, setTotalReceived] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [marginPct, setMarginPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        const result = await axios(
          'https://api.bitkub.com/api/market/ticker?sym=THB_USDT'
        );

        setUSDTPrice(result.data.THB_USDT.last);
      };

      fetchData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (exchange === EXCHANGE.BITKUB) {
      setDisplayedCurrentcy('THB');
      setFormValues((prev) => ({
        ...prev,
        fee: 0.25,
      }));
    } else {
      setDisplayedCurrentcy('USDT');
      setFormValues((prev) => ({
        ...prev,
        fee: 0.1,
      }));
    }
  }, [exchange]);

  useEffect(() => {
    const total =
      (formValues.amount * (100 - formValues.fee)) / 100 / formValues.buy;

    setTotalReceived(isNaN(total) ? 0 : total);
  }, [formValues.amount, formValues.fee, formValues.buy]);

  useEffect(() => {
    const newSellAmount =
      (totalReceived * formValues.sell * (100 - formValues.fee)) / 100;
    setSellAmount(isNaN(newSellAmount) ? 0 : newSellAmount);
  }, [formValues.sell, totalReceived, formValues.fee]);

  useEffect(() => {
    const newMargin = sellAmount - formValues.amount;
    setMargin(isNaN(newMargin) ? 0 : newMargin);

    const newMarginPct =
      ((sellAmount - formValues.amount) / formValues.amount) * 100;
    setMarginPct(isNaN(newMarginPct) ? 0 : newMarginPct);
  }, [sellAmount, formValues.amount]);

  const onChangeExchange = (event) => {
    setExchange(event.target.value);
  };

  const onChangeInput = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClickReset = () => {
    setFormValues({
      ...initialFormValues,
      fee: exchange === EXCHANGE.BITKUB ? 0.25 : 0.1,
    });
  };

  return (
    <Wrapper>
      <Row>
        <Col
          xs={{ offset: 2, span: 20 }}
          md={{ offset: 6, span: 12 }}
          lg={{ offset: 8, span: 8 }}
        >
          <div className="title">May The Force Be With You.</div>
          <StyledCard>
            <div className="radio-container">
              <Radio.Group
                onChange={onChangeExchange}
                defaultValue={EXCHANGE.BITKUB}
                buttonStyle="solid"
              >
                <Radio.Button value={EXCHANGE.BITKUB}>BITKUB</Radio.Button>
                <Radio.Button value={EXCHANGE.BINANCE}>BINANCE</Radio.Button>
              </Radio.Group>
            </div>
            <div className="content">
              <FormDiv>
                <label>Amount Spent</label>
                <InputNumber
                  className="input-number"
                  formatter={formatAmount}
                  parser={parserFormatAmount}
                  onChange={(val) => onChangeInput('amount', val)}
                  value={formValues.amount}
                />
              </FormDiv>
              <Row gutter={8}>
                <Col span={12}>
                  <FormDiv>
                    <label className="buy">Buying Price</label>
                    <InputNumber
                      className="input-number"
                      formatter={formatAmount}
                      parser={parserFormatAmount}
                      onChange={(val) => onChangeInput('buy', val)}
                      value={formValues.buy}
                    />
                  </FormDiv>
                </Col>
                <Col span={12}>
                  <FormDiv>
                    <label className="sell">Selling Price</label>
                    <InputNumber
                      className="input-number"
                      formatter={formatAmount}
                      parser={parserFormatAmount}
                      onChange={(val) => onChangeInput('sell', val)}
                      value={formValues.sell}
                    />
                  </FormDiv>
                </Col>
              </Row>
              <Row>
                <FormDiv>
                  <label>Fee (%)</label>
                  <InputNumber
                    onChange={(val) => onChangeInput('fee', val)}
                    value={formValues.fee}
                  />
                </FormDiv>
              </Row>
            </div>
            <Row>
              <Col>
                <StyledStatistic title="Total Received" value={totalReceived} />
              </Col>
            </Row>
            <div className="margin">
              <div>
                Sell Amount: {formatAmount(sellAmount.toFixed(2))}{' '}
                {isBinance(exchange)
                  ? `${displayedCurrency} ~ ${formatAmount(
                      USDTPrice * sellAmount,
                      2
                    )} THB`
                  : displayedCurrency}
              </div>
              <div>
                Margin: {formatAmount(margin.toFixed(2))}{' '}
                {isBinance(exchange)
                  ? `${displayedCurrency} ~ ${formatAmount(
                      USDTPrice * margin,
                      2
                    )} THB`
                  : displayedCurrency}
              </div>
              <div>Percent: {formatAmount(marginPct.toFixed(2))} %</div>
              {isBinance(exchange) && (
                <div>Realtime USDT/THB: {USDTPrice} THB</div>
              )}
            </div>
            <div className="button">
              <Button
                size="large"
                style={{ backgroundColor: '#131822', color: '#fff' }}
                onClick={onClickReset}
              >
                Reset
              </Button>
            </div>
          </StyledCard>
        </Col>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 70px 0;
  color: #fff;

  .title {
    text-align: center;
    margin-bottom: 20px;
  }

  .radio-container {
    text-align: center;
  }

  .content {
    padding-top: 20px;
  }

  .margin {
    color: #fff;
    margin-top: 10px;
  }

  .button {
    margin-top: 20px;
  }
`;

const StyledCard = styled(Card)`
  background-color: #171c27;
  border-color: #181d28;

  .ant-card-body {
    padding-top: 10px;
  }
`;

const FormDiv = styled.div`
  margin-bottom: 24px;
  color: #fff;

  label {
    font-size: 12px;
    display: block;
    text-align: left;
    margin-bottom: 3px;

    &.buy {
      color: green;
    }

    &.sell {
      color: red;
    }
  }
  .input-number {
    width: 100%;
  }
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic {
    line-height: 1;
  }

  .ant-statistic-title {
    color: #fff;
  }

  .ant-statistic-content-value {
    color: #fff;
    font-size: 14px;
  }
`;

export default Main;
