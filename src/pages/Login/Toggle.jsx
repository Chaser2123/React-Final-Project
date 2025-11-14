export default function Toggle({ label, index, active, onClick }) {
	return (
		<span
			className={`${active === index ? 'font-semibold text-slate-900' : 'text-indigo-400'} relative z-10 cursor-pointer py-1 px-3 text-lg select-none`}
			onClick={() => onClick(index)}
			id={label}
			role="button"
			aria-pressed={active === index}
		>
			{label}
		</span>
	)
}