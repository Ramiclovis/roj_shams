import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WhatWeDo() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/objectives', { replace: true })
    }, [navigate])
    return null
}
