import { LEDOperationMode, TwinklyClient } from '@twinklyjs/twinkly';
import { useEffect, useState } from 'react';
import './App.css';
import type { ColorResult } from '@uiw/color-convert';
import Wheel from '@uiw/react-color-wheel';
import AudioVisualizer from './AudioVisualizer';

const client = new TwinklyClient({
	ip: 'localhost:3000',
	additionalHeaders: { 'x-twinkly-ip': '10.0.0.185' },
});

function App() {
	const [count, setCount] = useState(0);
	const [summary, setSummary] = useState('');
	const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		(async () => {
			await client.setLEDOperationMode({ mode: LEDOperationMode.COLOR });
			const res = await client.getSummary();
			setSummary(JSON.stringify(res, null, 2));
		})();
	}, []);

	const onChange = (color: ColorResult) => {
		if (isUpdating) return;
		setIsUpdating(true);
		console.log('color', color.rgb);
		setHsva({ ...hsva, ...color.hsva });
		(async () => {
			try {
				await client.setLEDColor({
					red: color.rgb.r,
					green: color.rgb.g,
					blue: color.rgb.b,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setIsUpdating(false);
			}
		})();
	};

	return (
		<>
			<div>
				<Wheel color={hsva} onChange={onChange} />
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
			<AudioVisualizer client={client} />
		</>
	);
}

export default App;
