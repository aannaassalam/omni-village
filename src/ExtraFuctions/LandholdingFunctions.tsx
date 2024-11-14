// NOTE: FUNCTION1
// useEffect(() => {
//   const land_use = values?.land_under_use;

//   // Determine how many purposes/statuses to handle based on `land_under_use`
//   const totalPurpose = land_use ? values.total_purpose.length : 0;
//   const totalStatus = !land_use ? values.status_of_land.length : 0;

//   // Create new data entries for `purpose_land_utilised_for` or `purpose_status_of_land`
//   const newDetailsOfLand = land_use
//     ? data?._id
//       ? data.purpose_land_utilised_for.map((item, index) => ({
//           type: item?.type || '',
//           total_land_area_utilised: String(
//             item?.total_land_area_utilised || '',
//           ),
//           type_category: item?.type_category || [],
//         }))
//       : Array(totalPurpose)
//           .fill()
//           .map((_, index) => ({
//             type: values?.total_purpose[index]?.type || '',
//             total_land_area_utilised: String(
//               values?.total_purpose[index]?.total_land_area_utilised || '',
//             ),
//             type_category: values?.total_purpose[index]?.type_category || [],
//           }))
//     : data?._id
//     ? data?.purpose_status_of_land.map((item, index) => ({
//         type: item?.type || '',
//         total_land_area_utilised: String(item?.total_land_area_utilised || ''),
//         type_category: item?.type_category || [],
//       }))
//     : Array(totalStatus)
//         .fill()
//         .map((_, index) => ({
//           type: values?.status_of_land[index]?.type || '',
//           total_land_area_utilised: String(
//             values?.status_of_land[index]?.total_land_area_utilised || '',
//           ),
//           type_category: values?.status_of_land[index]?.type_category || [],
//         }));

//   // Merge new and old data for purpose and status of land
//   resetForm({
//     values: {
//       purpose_land_utilised_for:
//         [
//           ...newDetailsOfLand.map(item => ({
//             type: item?.type,
//             total_land_area_utilised:
//               String(item?.total_land_area_utilised) ||
//               item?.total_land_area_utilised,
//             type_category: item?.type_category,
//           })),
//         ] || [],
//       purpose_status_of_land:
//         [
//           ...newDetailsOfLand.map(item => ({
//             type: item?.type,
//             total_land_area_utilised:
//               String(item?.total_land_area_utilised) ||
//               item?.total_land_area_utilised,
//             type_category: item?.type_category,
//           })),
//         ] || [],
//       land_under_use: data?.land_under_use || false,
//       total_purpose: data?.total_purpose || [],
//       status_of_land:
//         [...data?.status_of_land, ...values?.status_of_land] || [],
//     },
//   });
// }, [
//   data,
//   values.land_under_use,
//   values.total_purpose,
//   // values.status_of_land,
// ]);
// NOTE: FUNCTION2
// useEffect(() => {
  //   const land_use = values?.land_under_use;
  //   const totalPurpose = land_use
  //     ? parseInt(values.total_purpose.length || 0)
  //     : [];
  //   const totalStatus = !land_use
  //     ? parseInt(values?.status_of_land.length || 0)
  //     : [];

  //   // Create new data entries based on `land_under_use`
  //   const newDetailsOfLand = land_use
  //   ? Array(totalPurpose)
  //       .fill()
  //       .map((_, index) => ({
  //         type: values?.total_purpose[index] || '',
  //         total_land_area_utilised: values?.total_purpose[index]?.total_land_area_utilised || '',
  //         type_category: values?.total_purpose[index]?.type_category || [],
  //       }))
  //   : Array(totalStatus)
  //       .fill()
  //       .map((_, index) => ({
  //         type: values?.status_of_land[index] || '',
  //         total_land_area_utilised: values?.status_of_land[index]?.total_land_area_utilised || '',
  //         type_category: values?.status_of_land[index]?.type_category || [],
  //       }));

  //   // Only update if there is a new change to `land_use`
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     purpose_land_utilised_for: land_use
  //       ? [...prevValues.purpose_land_utilised_for, ...data?.purpose_land_utilised_for, ...newDetailsOfLand].reduce(
  //         (uniqueItems, item) =>
  //           uniqueItems.some((existing) => existing.type === item.type &&
  //             existing.total_land_area_utilised === item.total_land_area_utilised &&
  //             JSON.stringify(existing.type_category) === JSON.stringify(item.type_category))
  //             ? uniqueItems
  //             : [...uniqueItems, item],
  //         []
  //       )
  //       : prevValues.purpose_land_utilised_for,
  //     purpose_status_of_land: !land_use
  //       ? [...prevValues.purpose_status_of_land, ...(data?.purpose_status_of_land||[]), ...newDetailsOfLand].reduce(
  //         (uniqueItems, item) =>
  //           uniqueItems.some((existing) => existing.type === item.type &&
  //             existing.total_land_area_utilised === String(item.total_land_area_utilised) &&
  //             JSON.stringify(existing.type_category) === JSON.stringify(item.type_category))
  //             ? uniqueItems
  //             : [...uniqueItems, item],
  //         []
  //       )
  //       : prevValues.purpose_status_of_land,
  //   }));
  // }, [
  //   values.land_under_use,
  //   values.total_purpose,
  //   values.status_of_land,
  // ]);
