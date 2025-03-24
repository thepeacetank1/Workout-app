// Mock implementation for @chakra-ui/icons
const React = require('react');

// Create a function to generate icon mocks
const createIconMock = (name) => {
  const Icon = (props) => 
    React.createElement('div', { 
      'data-testid': `chakra-icon-${name.toLowerCase()}`,
      ...props
    });
  Icon.displayName = `${name}Icon`;
  return Icon;
};

// Export common icons used in the app
module.exports = {
  ChevronDownIcon: createIconMock('ChevronDown'),
  ChevronRightIcon: createIconMock('ChevronRight'),
  ChevronLeftIcon: createIconMock('ChevronLeft'),
  ChevronUpIcon: createIconMock('ChevronUp'),
  CheckIcon: createIconMock('Check'),
  CloseIcon: createIconMock('Close'),
  SearchIcon: createIconMock('Search'),
  AddIcon: createIconMock('Add'),
  MinusIcon: createIconMock('Minus'),
  InfoIcon: createIconMock('Info'),
  WarningIcon: createIconMock('Warning'),
  EmailIcon: createIconMock('Email'),
  LockIcon: createIconMock('Lock'),
  CalendarIcon: createIconMock('Calendar'),
  TimeIcon: createIconMock('Time'),
  StarIcon: createIconMock('Star'),
  EditIcon: createIconMock('Edit'),
  DeleteIcon: createIconMock('Delete'),
  ArrowBackIcon: createIconMock('ArrowBack'),
  ArrowForwardIcon: createIconMock('ArrowForward'),
  ArrowUpIcon: createIconMock('ArrowUp'),
  ArrowDownIcon: createIconMock('ArrowDown'),
  QuestionIcon: createIconMock('Question'),
  ExternalLinkIcon: createIconMock('ExternalLink'),
  AtSignIcon: createIconMock('AtSign'),
  BellIcon: createIconMock('Bell'),
  SettingsIcon: createIconMock('Settings'),
  ViewIcon: createIconMock('View'),
  ViewOffIcon: createIconMock('ViewOff'),
  HamburgerIcon: createIconMock('Hamburger'),
  SpinnerIcon: createIconMock('Spinner'),
  PhoneIcon: createIconMock('Phone'),
  InfoOutlineIcon: createIconMock('InfoOutline'),
  WarningTwoIcon: createIconMock('WarningTwo'),
  AttachmentIcon: createIconMock('Attachment'),
  DownloadIcon: createIconMock('Download'),
  RepeatIcon: createIconMock('Repeat'),
  SmallAddIcon: createIconMock('SmallAdd')
};