import axios from 'axios'

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/musics`;
class MusicService {
  static async createMusic(infoSong, music, album, isYoutube = false) {
    let response

    try {
      if (isYoutube) {
        const formData = new FormData()
        formData.append('infoSong', JSON.stringify(infoSong))

        response = await axios.post(`${endpoint}`, formData, {
          headers: {
            'access_token': localStorage.getItem('access_token')
          }
        })
      } else {
        const formData = new FormData()
        formData.append('song', music)
        formData.append('albumCover', album)
        formData.append('infoSong', JSON.stringify(infoSong))

        response = await axios.post(`${endpoint}`, formData, {
          headers: {
            'access_token': localStorage.getItem('access_token')
          }
        })
      }
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  static async getMusics() {
    try {
      const response = await axios.get(`${endpoint}`, {
        headers: {
          'access_token': localStorage.getItem('access_token')
        }
      })

      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  static async deleteMusic(musicId) {
    try {
      const response = await axios.delete(`${endpoint}/${musicId}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  static async getMusicByOwnerId(ownerId, limit, offset) {
    try {
      const response = await axios.get(`${endpoint}/owner/${ownerId}`, {
        params: {
          limit,
          offset
        },
        headers: {
          'access_token': localStorage.getItem('access_token')
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default MusicService