import React, { useState, useEffect, useCallback } from 'react';
import iconMap from '../components/IconMap';
import ResourceListView from '../components/ResourceListView';
import ResourceCardView from '../components/ResourceCardView';
import AppHeader from '../components/AppHeader';
import ResourceType from '../components/ResourceType';
import AccessTypeSection from '../components/AccessTypeSection';
import FilterField from '../components/FilterField';
import ViewToggleButtons from '../components/ViewToggleButtons';
import DataSourceToggle from '../components/DataSourceToggle';
import { accessTypes } from '../data/accessTypes';
import { useDataService } from '../hooks/useDataService';
import { PAGINATION } from '../constants';

const MainPage = () => {
	const [view, setView] = useState('list');
	const [search, setSearch] = useState('');
	const [accessType, setAccessType] = useState('computers');
	const [accessSubType, setAccessSubType] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState('');
	const [sortDir, setSortDir] = useState('asc');

	// Use the new data service hook
	const {
		loading,
		error,
		data: currentData,
		pagination,
		useMockAPI,
		fetchResources,
		clearError,
		toggleDataSource
	} = useDataService();

	// Find selected access type object
	const selectedAccessType = accessTypes.find(opt => opt.value === accessType) || accessTypes[0];
	
	// Get page size based on view type
	const getPageSize = useCallback(() => {
		return view === 'list' ? PAGINATION.LIST_PAGE_SIZE : PAGINATION.CARD_PAGE_SIZE;
	}, [view]);

	// Fetch data when access type changes
	useEffect(() => {
		const loadData = async () => {
			try {
				const pageSize = getPageSize();
				setCurrentPage(1); // Reset to first page when changing resource type
				// Remove automatic sorting reset - let user maintain their sorting preference
				// setSortField(''); // Reset sorting when changing resource type
				// setSortDir('asc');
				await fetchResources(accessType, {
					search: search || undefined,
					page: 1,
					pageSize: pageSize,
					sortField: sortField || undefined,
					sortDirection: sortDir
				});
			} catch (err) {
				console.error('Failed to load data:', err);
			}
		};

		loadData();
	}, [accessType, fetchResources, getPageSize]); // Remove sortField and sortDir from dependencies to prevent infinite loops

	// Fetch data when search changes (with debouncing)
	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			if (accessType) {
				try {
					const pageSize = getPageSize();
					setCurrentPage(1); // Reset to first page when searching
					await fetchResources(accessType, {
						search: search || undefined,
						page: 1,
						pageSize: pageSize,
						sortField: sortField || undefined,
						sortDirection: sortDir
					});
				} catch (err) {
					console.error('Failed to search data:', err);
				}
			}
		}, 300); // 300ms debounce

		return () => clearTimeout(timeoutId);
	}, [search, accessType, fetchResources, getPageSize]); // Remove sortField and sortDir from dependencies

	// Handle page change
	const handlePageChange = useCallback(async (page) => {
		try {
			setCurrentPage(page);
			await fetchResources(accessType, {
				search: search || undefined,
				page: page,
				pageSize: getPageSize(),
				sortField: sortField || undefined,
				sortDirection: sortDir
			});
		} catch (err) {
			console.error('Failed to change page:', err);
		}
	}, [accessType, search, fetchResources, getPageSize, sortField, sortDir]);

	// Handle view change
	const handleViewChange = useCallback(async (newView) => {
		setView(newView);
		try {
			setCurrentPage(1); // Reset to first page when changing view
			await fetchResources(accessType, {
				search: search || undefined,
				page: 1,
				pageSize: newView === 'list' ? PAGINATION.LIST_PAGE_SIZE : PAGINATION.CARD_PAGE_SIZE,
				sortField: sortField || undefined,
				sortDirection: sortDir
			});
		} catch (err) {
			console.error('Failed to change view:', err);
		}
	}, [accessType, search, fetchResources, sortField, sortDir]);

	// Handle sort change
	const handleSort = useCallback(async (field, direction) => {
		try {
			setSortField(field);
			setSortDir(direction);
			setCurrentPage(1); // Reset to first page when sorting
			await fetchResources(accessType, {
				search: search || undefined,
				page: 1,
				pageSize: getPageSize(),
				sortField: field,
				sortDirection: direction
			});
		} catch (err) {
			console.error('Failed to sort data:', err);
		}
	}, [accessType, search, fetchResources, getPageSize]);

	// Handle data source toggle
	const handleDataSourceToggle = useCallback(async (newUseMockAPI) => {
		try {
			toggleDataSource(newUseMockAPI);
			// Reload data with new source
			const pageSize = getPageSize();
			setCurrentPage(1);
			await fetchResources(accessType, {
				search: search || undefined,
				page: 1,
				pageSize: pageSize,
				sortField: sortField || undefined,
				sortDirection: sortDir
			});
		} catch (err) {
			console.error('Failed to switch data source:', err);
		}
	}, [accessType, search, fetchResources, getPageSize, sortField, sortDir, toggleDataSource]);

	const dataCount = currentData ? currentData.length : 0;

	// Initial data loading
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const pageSize = getPageSize();
				await fetchResources(accessType, {
					page: 1,
					pageSize: pageSize
				});
			} catch (err) {
				console.error('Failed to load initial data:', err);
			}
		};

		loadInitialData();
	}, []); // Empty dependency array - runs only once

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<AppHeader />
			<div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 gap-4 sm:gap-6 flex-1">
				{/* Main Content */}
				<main className="flex-1 w-full">
					{/* Data Source Toggle */}
					<DataSourceToggle 
						useMockAPI={useMockAPI} 
						onToggle={handleDataSourceToggle} 
					/>
					
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
						{/* Left: Title, count, downward arrow with main access type dropdown */}
						<div className="flex items-center gap-2 relative">
							{/* Show selected access type icon and label */}
							<span className="flex items-center text-xl sm:text-2xl font-rubik font-semibold text-primary-main">
								{iconMap[selectedAccessType.icon]}
								<span className="ml-1">{selectedAccessType.label}</span>
							</span>
							{/* Show badge for current data type */}
							{pagination && pagination.total > 0 && (
								<span className="ml-2 bg-primary-main text-white text-xs font-bold rounded-full px-2 py-0.5">
									{pagination.total}
								</span>
							)}
							<ResourceType
								accessType={accessType}
								setAccessType={setAccessType}
								accessTypes={accessTypes}
								iconMap={iconMap}
							/>
						</div>

						<div className="flex items-center gap-2">
							<ViewToggleButtons view={view} setView={handleViewChange} />
						</div>
					</div>

					<div className="border-b border-gray-200 mb-4" />
					<div className="flex flex-col md:flex-row gap-4">
						<aside className="w-full md:w-64 flex-shrink-0 mb-4 md:mb-0">
							<AccessTypeSection accessSubType={accessSubType} setAccessSubType={setAccessSubType} />
						</aside>
						
						<div className="flex-1">
							<div className="mb-4 flex items-center">
								<FilterField value={search} onChange={e => setSearch(e.target.value)} />
							</div>
							
							{/* Show loading state */}
							{loading && (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
									<span className="ml-2 text-gray-600">Loading...</span>
								</div>
							)}

							{/* Show error state */}
							{error && (
								<div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<h3 className="text-sm font-medium text-red-800">Error loading data</h3>
											<div className="mt-2 text-sm text-red-700">
												<p>{error}</p>
											</div>
											<div className="mt-4">
												<button
													type="button"
													onClick={clearError}
													className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
												>
													Try again
												</button>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Show data views */}
							{!loading && !error && currentData && (
								<>
									{view === 'list' ? (
										<ResourceListView 
											data={currentData}
											search={search} 
											accessType={accessSubType}
											showDescription={false}
											pagination={pagination}
											onPageChange={handlePageChange}
											onSort={handleSort}
											currentSortField={sortField}
											currentSortDir={sortDir}
										/>
									) : (
										<ResourceCardView 
											data={currentData}
											search={search} 
											accessType={accessSubType}
											showDescription={true}
											pagination={pagination}
											onPageChange={handlePageChange}
										/>
									)}
								</>
							)}

							{/* Show empty state */}
							{!loading && !error && (!currentData || currentData.length === 0) && (
								<div className="text-center py-8">
									<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
									<p className="mt-1 text-sm text-gray-500">
										{search ? `No results found for "${search}"` : 'No data available for this resource type.'}
									</p>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default MainPage; 