LOG_DEBUG	   		=0x00000001
LOG_VERBOSE	    =0x00000002
LOG_DUMP	    	=0x00000004
LOG_FENTRY	    =0x00000008
LOG_EXCEPTION		=0x00000010
LOG_INFO	    	=0x00000020
LOG_WARN    		=0x00000040
LOG_ERROR   		=0x00000080
LOG_VERYVERBOSE	=0x00000100
LOG_FPARAMS 		=0x00000200
LOG_FRETURN 		=0x00000400
LOG_FRPARAM	    =0x00000800
LOG_BACKTRACE   =0x00001000

SLOG_DUMP_YAML		=0x00000001
SLOG_DUMP_JSON  	=0x00000002
SLOG_DUMP_INSPECT =0x00000004

$logTranslate = {
	LOG_DEBUG => 'D',
	LOG_VERBOSE => 'V',
	LOG_DUMP => 'Y',
	LOG_FENTRY => 'F',
	LOG_EXCEPTION => 'e',
	LOG_INFO => 'I',
	LOG_ERROR => 'E',
	LOG_VERYVERBOSE => "v",
	LOG_FPARAMS => 'P',
	LOG_FRETURN => 'R',
	LOG_FRPARAM => 'r',
}
module ServerLogEntriesHelper
    def convFlagsToString(flags)
        levelStr = ""
        $logTranslate.each do |key, value|
			if ((flags & key) != 0)  # GET /server_log_entries/1
				levelStr += value
			end
		end
		return('%12s' % levelStr)
    end                  
end