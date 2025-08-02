import React, { useEffect } from 'react'

const Test = () => {
  useEffect(() => {
    console.log('Test sayfası yüklendi!')
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Burası Test Sayfası</h1>
      <p className="mt-4 text-muted-foreground">
        Bu sayfa başarıyla oluşturuldu ve çalışıyor.
      </p>
    </div>
  )
}

export default Test