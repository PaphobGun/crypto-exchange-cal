import { InputNumber as AntdInputNumber } from 'antd';
import styled from 'styled-components';

function InputNumber({ suffix, ...restProps }) {
  if (suffix) {
    return (
      <>
        <StyledInputNumber {...restProps} suffix={suffix} />
        <Suffix className="ant-input-group-addon">{suffix}</Suffix>
      </>
    );
  } else {
    return <StyledInputNumber {...restProps} />;
  }
}

const StyledInputNumber = styled(AntdInputNumber)`
  ${({ suffix }) =>
    suffix &&
    `
    vertical-align: middle;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  `}

  width: ${({ width }) => width || 'unset'};
`;

const Suffix = styled.div`
  padding-top: 2px;
  vertical-align: middle;
  display: inline-table;
  line-height: 24px;
  height: 32px;
`;

export default InputNumber;
