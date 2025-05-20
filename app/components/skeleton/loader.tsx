import { Flex, Spin } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import React from 'react'

const Loader = () => {
  return (
    <Flex align="center" gap="middle" justify="center" className="h-96 w-full min-w-[400px]">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} className='!text-primaryGreen' spin />} />
    </Flex>
  );
}

export default Loader