const fs = require("fs")
const path = require("path")

const envPath = path.resolve(process.cwd(), ".env")
const timestamp = new Date().toISOString()

// 기존 .env 파일 읽기
let envContent = ""
if (fs.existsSync(envPath)) {
	envContent = fs.readFileSync(envPath, "utf8")
}

// REACT_APP_BUILD_TIMESTAMP가 있는지 확인
const timestampRegex = /^REACT_APP_BUILD_TIMESTAMP=.*$/m
if (timestampRegex.test(envContent)) {
	// 기존 타임스탬프 업데이트
	envContent = envContent.replace(
		timestampRegex,
		`REACT_APP_BUILD_TIMESTAMP=${timestamp}`,
	)
} else {
	// 새 타임스탬프 추가
	envContent += `\nREACT_APP_BUILD_TIMESTAMP=${timestamp}`
}

// 수정된 내용을 .env 파일에 쓰기
fs.writeFileSync(envPath, envContent.trim() + "\n")

console.log("Build timestamp updated in .env file")
