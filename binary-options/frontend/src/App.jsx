import BinaryOptionsDApp from './components/BinaryOptionsDApp';
import { ContractProvider } from './components/contexts/ContractContext';

function App() {
    return (
        <ContractProvider>
            <BinaryOptionsDApp />
        </ContractProvider>
    );
}

export default App;