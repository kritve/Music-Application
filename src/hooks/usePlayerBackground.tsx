import { colors } from '@/constants/tokens'
import { useEffect, useState } from 'react'
import { getColors } from 'react-native-image-colors'
import { IOSImageColors, AndroidImageColors } from 'react-native-image-colors/build/types'

export const usePlayerBackground = (imageUrl: string) => {
    const initialState = {
        colorOne: { value: '', name: '' },
        colorTwo: { value: '', name: '' },
        colorThree: { value: '', name: '' },
        colorFour: { value: '', name: '' },
        rawResult: '',
      }

	const [imageColors, setImageColors] = useState(initialState)

    

    useEffect(() => {
        const fetchColors = async () => {
          const result = await getColors(imageUrl, {
            fallback: colors.background,
            pixelSpacing: 5,
            cache: true,
			key: imageUrl,
          })
         
    
          switch (result.platform) {
            case 'android':
            case 'web':
                setImageColors({
                colorOne: { value: result.lightVibrant, name: 'lightVibrant' },
                colorTwo: { value: result.dominant, name: 'dominant' },
                colorThree: { value: result.vibrant, name: 'vibrant' },
                colorFour: { value: result.darkVibrant, name: 'darkVibrant' },
                rawResult: JSON.stringify(result),
                })              
                break
            case 'ios':
                setImageColors({
                    colorOne: { value: result.background, name: 'background' },
                    colorTwo: { value: result.detail, name: 'detail' },
                    colorThree: { value: result.primary, name: 'primary' },
                    colorFour: { value: result.secondary, name: 'secondary' },
                    rawResult: JSON.stringify(result),
                  })
                break
            default:
              throw new Error('Unexpected platform')
          }
    
        } 

    
        fetchColors()
      }, [imageUrl])
    

	return {imageColors}
}
