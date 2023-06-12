import { useRecoilValue } from 'recoil'
import NavBar from './components/layout/navbar'
import { serverApiState } from './store/server'
import Footer from './components/layout/footer'
import { Introduce } from './components/home/introduce'
import { Index } from './components/home'


function App() {
  const api = useRecoilValue(serverApiState)
  return (
    <>
      <div className="fixed top-0 h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <NavBar />
      <main className="min-h-screen w-full">
        {api ? <Index /> : <Introduce />}
      </main>
      <Footer />
    </>
  )
}

export default App
