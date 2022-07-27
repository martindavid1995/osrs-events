import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../redux/counterSlice'

const Counter = () => {
	const count = useSelector((state) => state.counter.value)
	const dispatch = useDispatch()

	return (
		<div>
			<div>
				<p>{count}</p>
				<button onClick={() => dispatch(increment())}>Plus</button>
				<button onClick={() => dispatch(decrement())}>Minus</button>
			</div>
		</div>
	)
}

export default Counter
