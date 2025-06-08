import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import CodeTypingTest from '../components/CodeTypingTest'
import { SEO } from '../components/SEO'

export const Route = createFileRoute('/code')({
  component: () => (
    <>
      <SEO 
        title="Code Practice"
        description="Practice typing code snippets in various programming languages. Improve your coding speed and accuracy with our specialized code typing practice."
        keywords={['code typing', 'programming practice', 'code snippets', 'coding speed', 'programming languages']}
      />
      <RouteComponent />
    </>
  ),
})

function RouteComponent() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [selectedTime, setSelectedTime] = useState(60)

  const codeExamples = {
    javascript: `function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);
console.log(result); // Output: 15`,
    python: `def calculate_sum(numbers):
    return sum(numbers)

numbers = [1, 2, 3, 4, 5]
result = calculate_sum(numbers)
print(result)  # Output: 15`,
    java: `public class Calculator {
    public static int calculateSum(int[] numbers) {
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        return sum;
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int result = calculateSum(numbers);
        System.out.println(result); // Output: 15
    }
}`
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4">
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="select select-bordered"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="select select-bordered"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={Infinity}>No time limit</option>
          </select>
        </div>
        <CodeTypingTest 
          text={codeExamples[selectedLanguage as keyof typeof codeExamples]} 
          eclipsedTime={selectedTime}
          language={selectedLanguage}
        />
      </div>
    </div>
  )
}
