import { LEDOperationMode, type TwinklyClient } from '@twinklyjs/twinkly';
import { useRef } from 'react';

export interface AudioVisualizerProps {
	client: TwinklyClient;
}

const AudioVisualizer = ({ client }: AudioVisualizerProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	async function initAudio() {
		const audioContext = new window.AudioContext();
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const source = audioContext.createMediaStreamSource(stream);
		const analyser = new AnalyserNode(audioContext, {
			fftSize: 2048,
		});
		const bufferLength = analyser.frequencyBinCount;
		const dataArray1 = new Uint8Array(bufferLength);
		const dataArray2 = new Uint8Array(bufferLength);
		source.connect(analyser);
		const canvas = canvasRef.current;
		if (!canvas) return;
		const canvasCtx = canvas.getContext('2d');
		if (!canvasCtx) return;
		canvas.width = window.innerWidth;
		canvas.height = 200;
		// const {number_of_led} = await client.getDeviceDetails();
		await client.setLEDOperationMode({ mode: LEDOperationMode.RT });
		const token = client.getToken();
		if (!token) return;
		// const ip = '10.0.0.103';

		const draw = () => {
			requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray1);
			analyser.getByteTimeDomainData(dataArray2);
			canvasCtx.fillStyle = 'white';
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
			const barWidth = (canvas.width / bufferLength) * 2.5;
			let barHeight: number;
			let x1 = 0;

			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray1[i];
				canvasCtx.fillStyle = `rgb(0, ${barHeight + 100}, ${barHeight + 100})`;
				canvasCtx.fillRect(
					x1,
					canvas.height - barHeight,
					barWidth,
					barHeight / 2,
				);
				x1 += barWidth + 1;
			}

			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = 'blue';

			const sliceWidth = (canvas.width * 1.0) / bufferLength;
			let x2 = 0;

			canvasCtx.beginPath();
			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray2[i] / 128.0;
				const y = (v * canvas.height) / 2;

				if (i === 0) {
					canvasCtx.moveTo(x2, y);
				} else {
					canvasCtx.lineTo(x2, y);
				}

				x2 += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height);
			canvasCtx.stroke();
		};
		draw();
	}
	return (
		<div>
			<button type="button" onClick={() => initAudio()}>
				Start Audio
			</button>
			<canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
		</div>
	);
};

export default AudioVisualizer;
