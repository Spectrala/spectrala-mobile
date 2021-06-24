// import React from "react";
// import PropTypes from "prop-types";
// import {
//   FlatList,
//   ActivityIndicator,
//   RefreshControl,
//   SafeAreaView,
//   View,
//   BackHandler,
//   useState,
// } from "react-native";
// import { SessionCell } from "./SessionCell";

// const IN_SELECTION_MODE = false;

// const SESSIONS = [
//   {
//     name: "Beer's Law Lab",
//     date: new Date("9/17/2021"),
//     isSelected: false,
//     isUploaded: false,
//   },
//   {
//     name: "Yellowstone",
//     date: new Date("9/13/2021"),
//     isSelected: true,
//     isUploaded: true,
//   },
// ];

// function SessionList(props) {
//   const [refreshing, setRefreshing] = useState(false);

//   return (
//     <FlatList
//       data={SESSIONS}
//       renderItem={({ item }) => (
//         <SessionCell
//           name={item.name}
//           date={item.date}
//           inSelectionMode={IN_SELECTION_MODE}
//           isUploaded={item.isUploaded}
//           isSelected={item.isSelected}
//         />
//       )}
//       keyExtractor={(item) => String(item.name)}
//       refreshControl={
//         <RefreshControl
//           refreshing={this.state.refreshing}
//           onRefresh={this.onRefresh}
//         />
//       }
//       showsVerticalScrollIndicator={false}
//     />
//   );
// }

// SessionList.propTypes = {
//   name: PropTypes.string.isRequired,
//   date: PropTypes.date.isRequired,
//   onSelect: PropTypes.func,
//   inSelectionMode: PropTypes.bool.isRequired,
//   isUploaded: PropTypes.bool,
//   isSelected: PropTypes.bool,
// };
// // Later: Add preview of spectra

// export default SessionList;
