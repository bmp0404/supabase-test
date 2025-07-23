import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate } from "react-router-dom"

const Update = () => {

  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [method, setMethod] = useState('')
  const [rating, setRating] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !method || !rating) {
      setFormError('Please fill in all fields')
      return
    }

    const { data, error } = await supabase
      .from('smoothies')
      .update({ title, method, rating })
      .eq('id', id)
      .select()

    if (error) {
      setFormError('Could not update the smoothie')
      console.log(error)
      return
    }

    if (data) {
      setFormError(null)
      console.log(data)
      navigate('/')
    }
  }

  useEffect(() => {
    const fetchSmoothe = async () => {
      const { data, error } = await supabase
        .from('smoothies')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        console.log(error)
        navigate('/', { replace: true })
      }

      if (data) {
        setTitle(data.title)
        setMethod(data.method)
        setRating(data.rating)
        console.log(data)
      }
    }

    fetchSmoothe()
  }, [id, navigate])

  return (
    <div className="page update">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="method">Method:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />

        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button>Update Smoothie Recipe</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Update