import { Shield, Clock, Globe } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Verification",
    description: "State-of-the-art encryption and security protocols to protect your data.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Quick turnaround times for efficient passport verification.",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "Adhering to international standards and regulations.",
  },
]

export default function Features() {
  return (
    (<section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>)
  );
}

