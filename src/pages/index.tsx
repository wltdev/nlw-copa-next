import Image from "next/image"
import mobilePreviewImg from '../assets/smartphones-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvataresExampleImg from '../assets/avatares-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
  poolsCount: number
  guessesCount: number
  usersCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  const createPool = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const { data } = await api.post('/pools', {
        title: poolTitle
      })
      
      await navigator.clipboard.writeText(data.code)
      alert('Bolão criado com sucesso!')
      setPoolTitle('')
    } catch (error) {
      console.log(error)
      alert('Falha ao criar o bolão. Tente novamente!')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="Logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvataresExampleImg} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            value={poolTitle}
            onChange={(evt) => setPoolTitle(evt.target.value)}
            className="flex-1 px-4 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text" 
            required 
            placeholder="Qual nome do seu bolão?" 
          />
          <button className="bg-yellow-500 px-4 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700" type="submit">
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />  

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={mobilePreviewImg} alt="Mobile Preview" />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [pools, guesses, users] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolsCount: pools.data.count,
      guessesCount: guesses.data.count,
      usersCount: users.data.count,
    }
  }
}
