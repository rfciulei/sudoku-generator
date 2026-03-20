{
	"targets": [
		{
			"target_name": "sudoku",
			"cflags!": [
				"-fno-exceptions"
			],
			'xcode_settings': {
				'OTHER_CFLAGS': [
					"-std=c++14",
					"-stdlib=libc++"
				]
			},
			"cflags_cc!": [ "-fno-exceptions" ],
			"sources": [ "./src/cpp/sudoku.cc" ],
			"include_dirs": [
				"<!@(node -p \"require('node-addon-api').include\")"
			],
			'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
		}
	]
}
