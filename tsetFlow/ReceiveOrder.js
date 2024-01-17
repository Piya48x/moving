import { View, Text } from 'react-native'
import React from 'react'

const ReceiveOrder = () => {
    const callDispatchAPI = async (pickupLocation, dropoffLocation, distance, shippingCost, totalCost) => {
        try {
          // ทำการเรียกใช้ API หรือการทำกิจกรรมที่เกี่ยวข้อง เพื่อแจ้งให้ระบบทราบว่ามีรถมารับของ
          // คุณต้องแทนที่ URL_API ด้วย URL ของ API ที่คุณใช้
          const response = await axios.post('URL_API', {
            pickupLocation,
            dropoffLocation,
            distance,
            shippingCost,
            totalCost,
          });
      
          // ตรวจสอบสถานะการตอบกลับจาก API
          if (response.status === 200) {
            // ทำงานเพิ่มเติมหลังจากที่ API ตอบกลับสำเร็จ
            console.log('ส่งรถมารับของสำเร็จ');
          } else {
            console.error('มีข้อผิดพลาดในการส่งรถมารับของ');
          }
        } catch (error) {
          console.error('มีข้อผิดพลาดในการเรียกใช้ API:', error.message);
        }
      };
      
      const handleConfirmDelivery = () => {
        // ทำการส่งสัญญานไปยังหน้ารับ order
        navigation.navigate('ReceiveOrder', {
          pickupLocation,
          dropoffLocation,
          distance,
          shippingCost: calculateShippingCost(),
          totalCost,
        });
      
        // ทำการเรียกใช้ฟังก์ชัน callDispatchAPI เพื่อแจ้งให้ระบบทราบว่ามีรถมารับของ
        callDispatchAPI(pickupLocation, dropoffLocation, distance, calculateShippingCost(), totalCost);
      };
      
  return (
    <View>
      <Text>ReceiveOrder</Text>
    </View>
  )
}

export default ReceiveOrder