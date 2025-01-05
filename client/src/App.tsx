import { api } from '@twinklyjs/twinkly';
import { useEffect, useState } from 'react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
	const [count, setCount] = useState(0);
	const [summary, setSummary] = useState('');

	useEffect(() => {
		(async () => {
			api.init('localhost:3000', {
				additionalHeaders: { 'x-twinkly-ip': '10.0.0.167' },
			});
			const res = await api.getSummary();
			setSummary(JSON.stringify(res, null, 2));
		})();
	}, []);

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Twinklyjs ON THE WEB</h1>
			<div className="card">
				<pre className="summary">{summary}</pre>
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
