import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import api from "../../../utils/axios";
import { useSelector } from 'react-redux';

function StrictModeDroppable(props) {
	const [enabled, setEnabled] = useState(false);



	useEffect(() => {
		const animation = requestAnimationFrame(() => setEnabled(true));
		return () => {
			cancelAnimationFrame(animation);
			setEnabled(false);
		};
	}, []);

	if (!enabled) {
		return null;
	}

	return <Droppable {...props} />;
}
function KanbanBoard() {
	const { user } = useSelector((state) => state.auth);
	const [columns, setColumns] = useState({
		request: {
			name: "Booking Requests",
			items: [],
		},
		confirmed: {
			name: "Confirmed",
			items: [],
		},
		canceled: {
			name: "Canceled",
			items: [],
		},
	});

	useEffect(() => {
		// Fetch appointments for the provider
		async function fetchAppointments() {
			try {
				const response = await api.get(`/appointments/provider/${user.id}`); // replace with dynamic provider ID
				console.log(user);


				const groupedAppointments = response.data;

				// Map the response to the columns state
				setColumns({
					request: { name: "Booking Requests", items: groupedAppointments.request },
					confirmed: { name: "Confirmed", items: groupedAppointments.confirmed },
					canceled: { name: "Canceled", items: groupedAppointments.canceled },
				});
			} catch (error) {
				console.error("Failed to fetch appointments", error);
			}
		}

		fetchAppointments();
	}, []);

	const onDragEnd = async (result) => {
		const { source, destination } = result;

		if (!destination) return;

		if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return;
		}

		// Get the source and destination columns
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];

		// Copy the items to move
		const sourceItems = Array.from(sourceColumn.items);
		const destItems = Array.from(destColumn.items);

		const [removed] = sourceItems.splice(source.index, 1);
		destItems.splice(destination.index, 0, removed);

		// Update state after dragging
		setColumns({
			...columns,
			[source.droppableId]: { ...sourceColumn, items: sourceItems },
			[destination.droppableId]: { ...destColumn, items: destItems },
		});

		// Update the status in the database using the PATCH endpoint
		try {
			await api.patch(`/appointments/${removed.id}`, {
				status: destination.droppableId, // 'confirmed' or 'canceled'
			});
		} catch (error) {
			console.error("Failed to update appointment status", error);
			// Revert if the update fails
			setColumns(columns);
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{Object.entries(columns)?.map(([columnId, column]) => (
					<div key={columnId} className="bg-gray-700/30 rounded-xl p-6 flex flex-col">
						<h2 className="text-xl font-semibold text-blue-400 mb-6">{column.name}</h2>

						<StrictModeDroppable droppableId={columnId}>
							{(provided, snapshot) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={`flex-1 min-h-[300px] rounded-lg transition-colors duration-200 ${snapshot.isDraggingOver ? "bg-gray-600/30" : "bg-gray-700/30"
										} ${snapshot.isDraggingOver ? "border-2 border-dashed border-blue-500/50" : ""} p-4`}
								>
									{column.items?.map((item, index) => (
										<Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={{ ...provided.draggableProps.style }}
													className={`relative mb-3 p-4 rounded-lg shadow-lg select-none transition-colors duration-200 ${snapshot.isDragging ? "shadow-xl ring-2 ring-blue-500/50" : ""
														} ${snapshot.isDragging ? "bg-blue-600" : "bg-gray-800/90"} border border-gray-600/50 hover:border-blue-500/50 hover:bg-gray-700/90 cursor-grab active:cursor-grabbing ${snapshot.isDragging ? "z-50" : "z-10"}`}
												>
													<div className={`${snapshot.isDragging ? "transform-none" : ""} flex items-center gap-3`}>
														<div className="text-gray-400">⋮⋮</div>
														<div className="flex-1">
															<p className="text-white font-medium">{item.customer.name} - {item.service.title}</p>
															<p className="text-sm text-gray-400 mt-1">Customer contact : {item.customer.email}</p>
															<p className="text-sm text-gray-400 mt-1">Booking ID: #{item.id}</p>
														</div>
													</div>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</StrictModeDroppable>
					</div>
				))}
			</div>
		</DragDropContext>
	);
}

export default KanbanBoard;
