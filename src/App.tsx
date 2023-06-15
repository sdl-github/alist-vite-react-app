import { useRecoilValue } from 'recoil'
import { serverApiState } from './store/server'
import { Introduce } from './components/home/introduce'
import { Index } from './components/home'


function App() {
  const api = useRecoilValue(serverApiState)
  return (
    <>
        {api ? <Index /> : <Introduce />}
    </>
  )
}

export default App
