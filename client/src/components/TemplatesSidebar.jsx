import { useState, useEffect } from 'react'
import { Layers, ChevronRight } from 'lucide-react'

export default function TemplatesSidebar({ onApplyTemplate }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const result = await response.json()
      if (result.success) {
        setTemplates(result.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateClick = (template) => {
    onApplyTemplate(template.data)
  }

  return (
    <div className="card sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Quick Templates
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Loading templates...
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 border border-transparent transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {template.category}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <p className="text-xs text-primary-800 dark:text-primary-300">
          💡 <strong>Tip:</strong> Click any template to auto-fill the form with suggested values.
        </p>
      </div>
    </div>
  )
}
