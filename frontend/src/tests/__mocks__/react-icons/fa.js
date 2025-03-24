// Mock implementation for react-icons/fa
const React = require('react');

// Create a simple icon mock that doesn't cause infinite recursion
const createIconMock = (name) => {
  const Icon = (props) => 
    React.createElement('span', { 
      'data-testid': `fa-icon-${name.toLowerCase()}`,
      ...props
    });
  Icon.displayName = name;
  return Icon;
};

// Export common icons used in the app
module.exports = {
  FaEye: createIconMock('FaEye'),
  FaEyeSlash: createIconMock('FaEyeSlash'),
  FaGoogle: createIconMock('FaGoogle'),
  FaFacebook: createIconMock('FaFacebook'),
  FaApple: createIconMock('FaApple'),
  FaUser: createIconMock('FaUser'),
  FaEnvelope: createIconMock('FaEnvelope'),
  FaLock: createIconMock('FaLock'),
  FaStar: createIconMock('FaStar'),
  FaEdit: createIconMock('FaEdit'),
  FaTrash: createIconMock('FaTrash'),
  FaCheck: createIconMock('FaCheck'),
  FaTimes: createIconMock('FaTimes'),
  FaPlus: createIconMock('FaPlus'),
  FaMinus: createIconMock('FaMinus'),
  FaArrowRight: createIconMock('FaArrowRight'),
  FaArrowLeft: createIconMock('FaArrowLeft'),
  FaBars: createIconMock('FaBars'),
  FaCog: createIconMock('FaCog'),
  FaSignOutAlt: createIconMock('FaSignOutAlt'),
  FaHome: createIconMock('FaHome'),
  FaDumbbell: createIconMock('FaDumbbell'),
  FaUtensils: createIconMock('FaUtensils'),
  FaCalendarAlt: createIconMock('FaCalendarAlt'),
  FaChartLine: createIconMock('FaChartLine'),
  FaUserAlt: createIconMock('FaUserAlt'),
  FaWeight: createIconMock('FaWeight'),
  FaRunning: createIconMock('FaRunning'),
  FaSwimmer: createIconMock('FaSwimmer'),
  FaBiking: createIconMock('FaBiking'),
  FaHeartbeat: createIconMock('FaHeartbeat'),
  FaWalking: createIconMock('FaWalking'),
  FaMedal: createIconMock('FaMedal'),
  FaTrophy: createIconMock('FaTrophy'),
  FaStopwatch: createIconMock('FaStopwatch'),
  FaAppleAlt: createIconMock('FaAppleAlt'),
  FaCarrot: createIconMock('FaCarrot'),
  FaClipboardList: createIconMock('FaClipboardList'),
  FaShoppingCart: createIconMock('FaShoppingCart'),
  FaChartBar: createIconMock('FaChartBar'),
  FaChartPie: createIconMock('FaChartPie'),
  FaChartArea: createIconMock('FaChartArea'),
  FaBell: createIconMock('FaBell'),
  FaExclamationCircle: createIconMock('FaExclamationCircle'),
  FaInfoCircle: createIconMock('FaInfoCircle'),
  FaQuestionCircle: createIconMock('FaQuestionCircle'),
  FaSearch: createIconMock('FaSearch'),
  FaUserPlus: createIconMock('FaUserPlus'),
  FaUserMinus: createIconMock('FaUserMinus'),
  FaUserCheck: createIconMock('FaUserCheck'),
  FaUserCog: createIconMock('FaUserCog'),
  FaUserCircle: createIconMock('FaUserCircle'),
  FaUserFriends: createIconMock('FaUserFriends'),
  FaCalendarPlus: createIconMock('FaCalendarPlus'),
  FaCalendarMinus: createIconMock('FaCalendarMinus'),
  FaCalendarCheck: createIconMock('FaCalendarCheck'),
  FaCalendarDay: createIconMock('FaCalendarDay'),
  FaCalendarWeek: createIconMock('FaCalendarWeek'),
  FaList: createIconMock('FaList'),
  FaListAlt: createIconMock('FaListAlt'),
  FaListUl: createIconMock('FaListUl'),
  FaListOl: createIconMock('FaListOl'),
  FaTable: createIconMock('FaTable'),
  FaFilePdf: createIconMock('FaFilePdf'),
  FaFileExcel: createIconMock('FaFileExcel'),
  FaFileDownload: createIconMock('FaFileDownload'),
  FaFileUpload: createIconMock('FaFileUpload'),
  FaSignInAlt: createIconMock('FaSignInAlt'),
  FaRegular: {
    FaRegularUser: createIconMock('FaRegularUser')
  },
  FaSolid: {
    FaSolidUser: createIconMock('FaSolidUser')
  }
};