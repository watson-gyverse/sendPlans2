import React, {ButtonHTMLAttributes, useCallback} from "react"
import debounce from "lodash/debounce"

interface DebouncedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
	debounceTime?: number
}

export const DebouncedButton: React.FC<DebouncedButtonProps> = ({
	onClick,
	debounceTime = 300,
	...props
}) => {
	const debouncedClick = useCallback(
		debounce(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				onClick(event)
			},
			debounceTime,
			{leading: true, trailing: false},
		),
		[onClick, debounceTime],
	)

	return <button {...props} onClick={debouncedClick} />
}
