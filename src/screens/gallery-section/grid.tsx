import {Gallery, Item} from "react-photoswipe-gallery"
import "photoswipe/dist/photoswipe.css"
export interface IGridGallery {
	url: string
	tUrl: string
	timestamp: number
}

function dateFormatter(timestamp: number): string {
	const date = new Date(timestamp * 1000)

	const dateText = `${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()} ${date.getHours()}:${date.getMinutes()} `
	return dateText
}

export const GridGallery = (props: {galleryProps: IGridGallery[]}) => {
	const {galleryProps} = props

	return (
		<div>
			<Gallery withCaption>
				{galleryProps.map((prop) => (
					<Item
						original={prop.url}
						thumbnail={prop.tUrl}
						width="800"
						height="600"
						caption={dateFormatter(prop.timestamp)}>
						{({ref, open}) => (
							<img
								ref={ref}
								onClick={open}
								src={prop.tUrl}
								alt={dateFormatter(prop.timestamp)}
							/>
						)}
					</Item>
				))}
			</Gallery>
		</div>
	)
}
